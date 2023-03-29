const mysql = require('mysql');
let connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '123',
  database: 'bdpweb'
});

function conectar() {
  try {
    connection.connect();
  } catch (err) {
    console.log("ERROR ESTEBAN" + err);
  }
}

function mandarQuery(query) {
  return new Promise((resolve, reject) => {
    connection.query(query, function (error, results, fields) {
      if (error) {
        reject(error);
      } else {
        resolve(results);
      }
    });
  });
}


let cliente = {
  nombre: 'Nepomuceno',
  rfc: 'NEPO231010',
  ciudad: 'Colima',
  email: 'conocido@gmail.com'
}

let factura = {
  fecha: '2023/03/23',
  total: 150,
  productos: [{
    id: 1,
    cantidad: 5,
    costo: 10
  }, {
    id: 2,
    cantidad: 5,
    costo: 20
  }
  ]
}


async function funcion(cliente, datosFactura) {
  try {
    let idCliente = await mandarQuery(`
    INSERT INTO clientes (Nombre, RFC, Ciudad, CP, Email) 
    VALUES ('${cliente.nombre}', '${cliente.rfc}', '${cliente.ciudad}',28000, '${cliente.email}')`);

    let idFactura = await mandarQuery(`
    INSERT INTO facturas (Fecha, Total, FK_Cliente) 
    VALUES ('${datosFactura.fecha}','${datosFactura.total}', ${idCliente.insertId})`);

    datosFactura.productos.forEach(async (producto) => {
      await mandarQuery(`
    INSERT INTO detalleFacturas (FK_Factura, FK_Producto, Cantidad, Costo) 
    VALUES (${idFactura.insertId},${producto.id},${producto.cantidad},${producto.costo})`);
    });

    console.log("ID del cliente: " + idCliente.insertId);
    console.log("ID de la factura: " + idFactura.insertId);
  } catch (error) {
    console.log(error);
  } finally {
    connection.end();
  }
}


conectar();
funcion(cliente, factura);




