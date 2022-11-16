require('dotenv').config()
global.Pusher = require('pusher-js')
const Echo = require('laravel-echo');
const { Server } = require('socket.io')
const axios = require('axios');

var defaultOptions = {
    broadcaster: 'pusher',
    key: process.env.APP_KEY,
    wsHost: process.env.APP_HOST,
    forceTLS: false,
    disableStats: true,
}

const echoClientPublic = new Echo.default(defaultOptions);

const io = new Server(3000)

io.on('connection', (socket) => {
    let handshake = socket.handshake;
    let bearerToken = handshake.auth.headers.Authorization

    axios.get('https://' + process.env.APP_HOST + '/api/accounts', {
        headers: {
            Authorization: bearerToken
        }
    })
    .then(function(response) {
        let userId = response['data']['data']['user']['id']

        defaultOptions.auth = {
            headers: {
                Authorization: bearerToken
            }
        }

        let echoClientPrivate = new Echo.default(defaultOptions);

        echoClientPrivate.channel('App.Models.User.' + userId)
            .listen('.broadcast_pix_receivement', (e) => { socket.emit('broadcast_pix_receivement', e); })
            .listen('.broadcast_pix_cashout', (e) => { socket.emit('broadcast_pix_cashout', e); })
            .listen('.broadcast_ted_receivement', (e) => { socket.emit('broadcast_ted_receivement', e); })
            .listen('.broadcast_fund_transfer', (e) => { socket.emit('broadcast_fund_transfer', e); })
            .listen('.broadcast_deposit_billet', (e) => { socket.emit('broadcast_deposit_billet', e); })
            .listen('.broadcast_card_transaction', (e) => { socket.emit('broadcast_card_transaction', e); })
            .listen('.broadcast_crypto_buy', (e) => { socket.emit('broadcast_crypto_buy', e); })
            .listen('.broadcast_crypto_sell', (e) => { socket.emit('broadcast_crypto_sell', e); })
            .listen('.generic_notification', (e) => { socket.emit('generic_notification', e); });

        echoClientPublic.channel('Cryptocurrency')
            .listen('.broadcast_market_updated', (e) => { socket.emit('broadcast_market_updated', e); })
            .listen('.broadcast_pairs_updated', (e) => { socket.emit('broadcast_pairs_updated', e); })

    })
    .catch(function(error) {
        socket.disconnect(true);
    })

})