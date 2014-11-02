from bottle import Bottle, static_file, request
import json
from itertools import takewhile

app = bottle.Bottle()

@app.get('/welcome')
def welcome():
    # Unlock if necessary.
    return open('index.html').read()

@app.post('/lock')
def lock_sites():
    to_block = json.loads(request.forms.get('block_sites'))
    until_date = request.forms.get('until_date')
    # check until_date is in the future.
    with open('/private/etc/hosts') as f:
        host_file = [line.strip('\n') for line in f]
    for ix, line in enumerate(host_file):
        if '#LockBook' in line:
            break
    else:
        ix = None

    if ix is not None:
        pieces = host_file[ix].split(' ')
        del host_file[ix]

        existing_sites = takewhile(lambda h: not h[0] == '#',
            pieces[1:])
        to_block = set(to_block) | set(existing_sites)

        existing_date = pieces[-1]
        until_date = max(until_date, existing_date)

    host_file.append('127.0.0.1 {sites} #LockBook {date}'.format(
        sites=' '.join(to_block),
        date=until_date))

    with open('/private/etc/hosts','w') as f:
        f.write('\n'.join(host_file))

    return {'status':'success'}

@app.route('/static/<filename>')
def server_static(filename):
    return static_file(filename, root='static/')

if __name__ == '__main__':
    app.run()