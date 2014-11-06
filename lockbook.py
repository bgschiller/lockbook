from bottle import Bottle, static_file, request, SimpleTemplate, HTTPResponse
import json
from datetime import date, datetime
from itertools import takewhile

app = Bottle()

def get_date(line):
    start, date = line.split(' #LockBook ', 1)
    return date

def get_sites(line):
    sites, rest = line.replace('127.0.0.1 ','')\
                      .rsplit(' #LockBook ', 1)
    return sites.split()

def remove_expired_locks():
    today = date.today().isoformat()
    with open('/etc/hosts') as f:
        host_lines = [line.strip('\n') for line in f]
    update_lines = filter(
        lambda line: ' #LockBook ' not in line or get_date(line) > today,
        host_lines)
    if len(update_lines) < len(host_lines):
        with open('/etc/hosts','w') as f:
            f.write('\n'.join(update_lines))

    return [{
            'expiry': get_date(line),
            'blocked_sites': get_sites(line)
    } for line in update_lines if ' #LockBook ' in line]


def with_without_www(sites):
    add_www = [ s.replace('www.','',1) for s in sites if s.startswith('www.')]
    remove_www = [ 'www.' + s for s in sites if not s.startswith('www.')]
    return add_www + remove_www + sites

templ = SimpleTemplate(open('index.html').read())
@app.get('/welcome')
def welcome():
    # Unlock if necessary.
    current_locks = remove_expired_locks()
    return templ.render(locks=current_locks)

def json_resp(data,**kwargs):
    return HTTPResponse(body=json.dumps(data), **kwargs)

@app.post('/lock')
def lock_sites():
    try:
        to_block = request.forms['block_sites']
        until_date = request.forms['until_date']

        to_block = with_without_www(json.loads(to_block))
        until_date = datetime.strptime(until_date,'%Y-%m-%d').date()
        assert until_date > date.today(), "Date must be in the future"
    except KeyError as e:
        return json_resp({
            'status':'error',
            'message':'missing required POST param, {}'.format(e)
            }, status=400)
    except (ValueError, AssertionError) as e:
        return json_resp({
            'status':'error',
            'message':str(e)
            }, status=400)

    with open('/etc/hosts') as f:
        host_file = [line.strip('\n') for line in f]

    host_file.append('127.0.0.1 {sites} #LockBook {date}'.format(
        sites=' '.join(to_block),
        date=until_date))
    try:
        with open('/etc/hosts','w') as f:
            f.write('\n'.join(host_file))
    except IOError:
        return json_resp({'status':'error',
            'message':'Permission denied. Did you start with admin rights?'}, status=401)

    return {'status':'success'}

@app.route('/static/<filename>')
def server_static(filename):
    return static_file(filename, root='static/')

if __name__ == '__main__':
    remove_expired_locks()
    app.run()