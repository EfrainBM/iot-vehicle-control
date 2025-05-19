const API_URL = "http://34.205.166.69:5000/api/devices";

// Variable global para guardar la IP pública
let ipPublica = "";

// Función para obtener la IP pública del cliente
function obtenerIpPublica() {
    fetch('https://api.ipify.org?format=json')
        .then(response => response.json())
        .then(data => {
            ipPublica = data.ip;
            console.log("IP Pública obtenida:", ipPublica);
        })
        .catch(error => {
            console.error("Error al obtener la IP pública:", error);
        });
}

// Función para enviar un comando a la API
function enviarComando(comando) {
    // Actualizar el movimiento en pantalla inmediatamente
    document.getElementById("movimientoActual").innerText = comando.toUpperCase();

    const payload = {
        name: "Efrain Bautista",
        ip: ipPublica,  // Usar IP pública o una IP por defecto
        status: comando
    };

    fetch(API_URL, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(payload)
    })
    .then(response => {
        if (response.ok) {
            console.log("Comando enviado correctamente:", comando);
        } else {
            console.error("Error al enviar comando");
        }
    })
    .catch(error => {
        console.error("Error de conexión:", error);
    });
}

// Ejecutar la función para obtener la IP al cargar la página
window.addEventListener('DOMContentLoaded', obtenerIpPublica);
