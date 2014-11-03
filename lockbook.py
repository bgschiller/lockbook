from bottle import Bottle, static_file, request
import json
from datetime import date, datetime
from itertools import takewhile

app = bottle.Bottle()

def get_date(line):
    start, date = line.split(' #LockBook ', 1)
    return date

def remove_expired_locks():
    today = date.today().isoformat()
    with open('/etc/hosts/') as f:
        host_lines = [line.strip('\n') for line in f]
    update_lines = filter(
        lambda line: ' #LockBook ' not in line or get_date(line) > today,
        host_lines)
    if len(update_lines) < len(host_lines):
        with open('/etc/hosts/','w') as f:
            f.write('\n'.join(update_lines))

@app.get('/welcome')
def welcome():
    # Unlock if necessary.
    remove_expired_locks()
    return open('index.html').read()

@app.post('/lock')
def lock_sites():
    try:
        to_block = request.forms.get('block_sites')
        until_date = request.forms.get('until_date')

        to_block = json.loads(to_block)
        until_date = datetime.strptime(until_date,'%Y-%m-%d').date()
    except ValueError as e:
        return {'status':'error','message':str(e)}

    with open('/etc/hosts') as f:
        host_file = [line.strip('\n') for line in f]

    host_file.append('127.0.0.1 {sites} #LockBook {date}'.format(
        sites=' '.join(to_block),
        date=until_date))

    with open('/etc/hosts','w') as f:
        f.write('\n'.join(host_file))

    return {'status':'success'}

@app.route('/static/<filename>')
def server_static(filename):
    return static_file(filename, root='static/')

if __name__ == '__main__':
    remove_expired_locks()
    app.run()