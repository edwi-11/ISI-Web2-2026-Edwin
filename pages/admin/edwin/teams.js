import TeamsService from "../../../shared/services/teams.service.js";
import TeamRequest from "../../../shared/models/request/team.request.js";

const api = new TeamsService();

const formTeam = document.getElementById("frmTeam");
const hiddenId = document.getElementById("teamCode");
const txtName = document.getElementById("txtName");
const txtDescription = document.getElementById("txtDescription");
const lblInfo = document.getElementById("lblInfo");
const bodyTable = document.getElementById("dataTeams");
const btnCancel = document.getElementById("btnCancel");

function notify(text, type = "success") {
    lblInfo.textContent = text;
    lblInfo.style.color = type === "error" ? "red" : "green";

    setTimeout(() => {
        lblInfo.textContent = "";
    }, 3000);
}

async function loadTeams() {
    bodyTable.innerHTML =
        '<tr><td colspan="5">Cargando registros...</td></tr>';

    try {
        const list = await api.get();

        bodyTable.innerHTML = "";

        if (!list.length) {
            bodyTable.innerHTML =
                '<tr><td colspan="5">Sin información disponible</td></tr>';
            return;
        }

        list.forEach(item => {

            const tr = document.createElement("tr");

            tr.innerHTML = `
                <td>${item.id}</td>
                <td>${item.name}</td>
                <td>${item.description ?? ""}</td>
                <td>${item.memberCount}</td>
                <td>
                    <button class="edit">Modificar</button>
                    <button class="remove">Borrar</button>
                </td>
            `;

            tr.querySelector(".edit")
                .addEventListener("click", () => loadForm(item));

            tr.querySelector(".remove")
                .addEventListener("click", () => removeTeam(item));

            bodyTable.appendChild(tr);
        });

    } catch (error) {
        bodyTable.innerHTML =
            `<tr><td colspan="5">${error.message}</td></tr>`;
    }
}

function loadForm(team) {
    hiddenId.value = team.id;
    txtName.value = team.name;
    txtDescription.value = team.description ?? "";
}

function clearForm() {
    hiddenId.value = "";
    txtName.value = "";
    txtDescription.value = "";
}

formTeam.addEventListener("submit", async e => {

    e.preventDefault();

    const request = new TeamRequest(
        txtName.value.trim(),
        txtDescription.value.trim()
    );

    try {

        if (hiddenId.value) {
            await api.update(hiddenId.value, request);
            notify("Registro actualizado");
        } else {
            await api.create(request);
            notify("Registro agregado");
        }

        clearForm();
        loadTeams();

    } catch (error) {
        notify(error.message, "error");
    }
});

btnCancel.addEventListener("click", clearForm);

async function removeTeam(team) {

    const answer = confirm(
        `¿Desea eliminar ${team.name}?`
    );

    if (!answer) return;

    try {

        await api.delete(team.id);

        notify("Registro eliminado");

        loadTeams();

    } catch (error) {

        notify(error.message, "error");
    }
}

loadTeams();