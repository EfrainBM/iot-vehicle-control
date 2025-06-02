const API_URL = "http://127.0.0.1:5000/api/devices";
let ipPublica = "";
let grabando = false;
let comandosGrabados = [];

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

function actualizarVelocidad() {
    const slider = document.getElementById("velocidadSlider");
    const valor = document.getElementById("velocidadValor");
    valor.value = slider.value;
}

function iniciarGrabacion() {
    grabando = true;
    comandosGrabados = [];
    document.getElementById("estadoGrabacion").innerText = "Grabando movimientos... (0/10)";
    document.getElementById("btnGrabar").disabled = true;
    document.getElementById("btnComenzar").disabled = false;
    document.getElementById("velocidadSlider").disabled = true;
}

async function comenzarGrabacion() {
    if (comandosGrabados.length >= 1 && comandosGrabados.length <= 10) {
        console.log("Enviando comandos grabados al backend...");
        console.table(comandosGrabados);

        try {
            for (const cmd of comandosGrabados) {
                const response = await fetch(API_URL, {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify(cmd)
                });

                if (!response.ok) {
                    throw new Error("Error en el envío de un comando.");
                }
            }

            document.getElementById("estadoGrabacion").innerText = "Comandos enviados con éxito.";
        } catch (error) {
            console.error("Error al enviar los comandos grabados:", error);
            document.getElementById("estadoGrabacion").innerText = "Error al enviar comandos.";
        }

        grabando = false;
        comandosGrabados = [];
        document.getElementById("btnGrabar").disabled = false;
        document.getElementById("btnComenzar").disabled = true;
        document.getElementById("velocidadSlider").disabled = false;
    } else {
        document.getElementById("estadoGrabacion").innerText = `Faltan movimientos. Grabados: ${comandosGrabados.length}/10`;
    }
}

function procesarComando(comando) {
    document.getElementById("movimientoActual").innerText = comando.toUpperCase();
    const velocidad = grabando ? 150 : parseInt(document.getElementById("velocidadSlider").value);

    const payload = {
        name: "Efrain Bautista",
        ip: ipPublica,
        status: comando,
        speed: velocidad
    };

    if (grabando) {
        if (comandosGrabados.length < 10) {
            comandosGrabados.push(payload);
            document.getElementById("estadoGrabacion").innerText = `Grabando movimientos... (${comandosGrabados.length}/10)`;
            if (comandosGrabados.length === 10) {
                document.getElementById("estadoGrabacion").innerText += " (Límite alcanzado)";
            }
        }
    } else {
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
                console.error("Error en la respuesta del servidor.");
            }
        })
        .catch(error => {
            console.error("Error de conexión con el backend:", error);
        });
    }
}

window.addEventListener('DOMContentLoaded', () => {
    obtenerIpPublica();
    actualizarVelocidad();
    document.getElementById("btnGrabar").disabled = false;
    document.getElementById("btnComenzar").disabled = true;
    document.getElementById("velocidadSlider").disabled = false;
});
