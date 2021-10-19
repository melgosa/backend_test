const { comprobarJWT } = require('../helpers/jwt');
const {io} = require('../index');
const { usuarioConectado, usuarioDesconectado, grabarMensaje } = require('../controllers/socket')

//Mensajes de sockets
io.on('connection', client => {

    const[valido, uid] = comprobarJWT(client.handshake.headers['x-token']);

    //Verificar autenticación
    if(!valido){ return client.disconnect();}

    //Cliente autenticado
    usuarioConectado( uid );

    //Ingresar al usuario a una sala/canal en particular
    client.join( uid );

    //Escuchar del cliente el mensaje-personal
    client.on('mensaje-personal', async ( payload ) => {
      //console.log(payload);
      await grabarMensaje( payload );
      io.to( payload.para ).emit('mensaje-personal', payload);
    });
   

    client.on('disconnect', () => { 
      usuarioDesconectado( uid );
     });

  });