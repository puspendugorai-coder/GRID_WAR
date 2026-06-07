from flask import Flask, render_template, request, session, redirect, url_for, jsonify
import json, math, uuid
from dotenv import load_dotenv
import os

load_dotenv()
app = Flask(__name__)
app.secret_key = os.getenv('FLASK_SECRET_KEY', 'fallback-dev-key')
port = int(os.getenv('FLASK_PORT', 5050))

def init_board(size):
    return ['' for _ in range(size * size)]

def check_winner(board, size):
    lines = []
    # rows
    for r in range(size):
        lines.append(list(range(r*size, r*size+size)))
    # cols
    for c in range(size):
        lines.append(list(range(c, size*size, size)))
    # diag
    lines.append(list(range(0, size*size, size+1)))
    lines.append(list(range(size-1, size*size-1, size-1)))

    for line in lines:
        vals = [board[i] for i in line]
        if vals[0] and all(v == vals[0] for v in vals):
            return vals[0], line
    if '' not in board:
        return 'draw', []
    return None, []

def get_grid_size(num_players):
    if num_players <= 2:
        return 3
    elif num_players <= 4:
        return 5
    else:
        return 6

SYMBOLS = ['X', 'O', '△', '□', '★', '◆']
COLORS  = ['#00f5ff', '#ff2d78', '#39ff14', '#ffd700', '#bf00ff', '#ff6600']

@app.route('/')
def index():
    session.clear()
    return render_template('index.html')

@app.route('/setup', methods=['POST'])
def setup():
    num = int(request.form.get('num_players', 2))
    num = max(2, min(6, num))
    names = []
    for i in range(num):
        name = request.form.get(f'name_{i}', '').strip()
        if not name:
            name = f'Player {i+1}'
        names.append(name)

    size = get_grid_size(num)
    session['players'] = [
        {'name': names[i], 'symbol': SYMBOLS[i], 'color': COLORS[i], 'score': 0}
        for i in range(num)
    ]
    session['size'] = size
    session['board'] = init_board(size)
    session['current'] = 0
    session['game_over'] = False
    session['winner'] = None
    session['winning_line'] = []
    return redirect(url_for('game'))

@app.route('/game')
def game():
    if 'players' not in session:
        return redirect(url_for('index'))
    return render_template('game.html',
        players=session['players'],
        size=session['size'],
        board=session['board'],
        current=session['current'],
        game_over=session['game_over'],
        winner=session['winner'],
        winning_line=session['winning_line']
    )

@app.route('/move', methods=['POST'])
def move():
    if 'board' not in session or session.get('game_over'):
        return jsonify({'error': 'invalid'}), 400

    data = request.get_json()
    idx  = data.get('index')
    board = session['board']
    size  = session['size']
    cur   = session['current']
    players = session['players']

    if board[idx] != '':
        return jsonify({'error': 'taken'}), 400

    board[idx] = players[cur]['symbol']
    session['board'] = board

    winner_sym, line = check_winner(board, size)
    result = {'board': board, 'current': cur, 'game_over': False, 'winner': None, 'winning_line': []}

    if winner_sym == 'draw':
        session['game_over'] = True
        result['game_over'] = True
        result['winner'] = 'draw'
    elif winner_sym:
        session['game_over'] = True
        winner_player = next(p for p in players if p['symbol'] == winner_sym)
        winner_player['score'] += 1
        session['players'] = players
        session['winner'] = winner_player
        session['winning_line'] = line
        result['game_over'] = True
        result['winner'] = winner_player
        result['winning_line'] = line
    else:
        session['current'] = (cur + 1) % len(players)
        result['current'] = session['current']

    result['players'] = players
    return jsonify(result)

@app.route('/restart')
def restart():
    if 'players' not in session:
        return redirect(url_for('index'))
    size = session['size']
    session['board'] = init_board(size)
    session['current'] = 0
    session['game_over'] = False
    session['winner'] = None
    session['winning_line'] = []
    return redirect(url_for('game'))

@app.route('/next_game')
def next_game():
    session.clear()
    return redirect(url_for('index'))

if __name__ == '__main__':
    port = int(os.getenv('PORT', 5050))
    app.run(host='0.0.0.0', port=port, debug=os.getenv('FLASK_ENV') == 'development')
