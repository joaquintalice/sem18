const URL = 'https://65423311f0b8287df1ffacb4.mockapi.io/users'
const endpoints = {

    getAll: async () => {
        try {
            const res = await fetch(URL);
            if (!res.ok) throw new Error(`Error fetching data`);
            const data = await res.json()
            return data
        } catch (error) {
        }
    },

    getById: async (id) => {
        try {
            const res = await fetch(`${URL}/${id}`);
            if (!res.ok) throw new Error(`Error fetching data`);
            const data = await res.json()
            return data
        } catch (error) {
        }
    },

    create: async (body) => {
        try {
            const res = await fetch(URL, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(body)
            });
            if (!res.ok) throw new Error(`Error fetching data`);
            const data = await res.json();
            return data
        } catch (error) {
        }
    },

    update: async (id, body) => {
        try {
            const res = await fetch(`${URL}/${id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(body)
            });
            if (!res.ok) throw new Error(`Error fetching data`);
            const data = await res.json();
            return data;
        } catch (error) {
        }
    },

    delete: async (id) => {
        try {
            const res = await fetch(`${URL}/${id}`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                }
            });
            if (!res.ok) throw new Error(`Error fetching data`);
            const data = await res.json();
            return data
        } catch (error) {
        }
    }
}

document.addEventListener('DOMContentLoaded', main);

async function main() {
    searchEvents()
}

function showAlert(status) {
    const notFoundAlert = document.getElementById('not-found-alert');
    notFoundAlert.classList.remove('d-none')
    notFoundAlert.classList.add('d-flex')
    setTimeout(() => {
        notFoundAlert.classList.add('d-none')
    }, 3000);
    return;
}

function searchEvents() {

    function getAllHandler() {
        const getBtn = document.getElementById("btnGet");
        const getInput = document.getElementById('inputGetId');

        getInput.addEventListener('input', (e) => {
            if (!e.target.value) {
                getBtn.disabled = true
            } else {
                getBtn.disabled = false
            }
        })


        getBtn.addEventListener("click", async () => {
            const searchValue = document.getElementById("inputGetId").value;

            if (!searchValue) {
                const data = await endpoints.getAll()
                await showData(data)
                return
            }
            const data = await endpoints.getById(searchValue)
            if (!data) {
                showAlert(data)
                return;
            }
            await showData([data])
        })
    }

    function createHandler() {
        const createBtn = document.getElementById("btnPost");
        const name = document.getElementById("inputPostNombre");
        const last_name = document.getElementById("inputPostApellido");

        name.addEventListener('input', () => {
            if (name.value && last_name.value) {
                createBtn.disabled = false
                return;
            }
            createBtn.disabled = true
        })

        last_name.addEventListener('input', () => {
            if (last_name.value && name.value) {
                createBtn.disabled = false
                return;
            }
            createBtn.disabled = true
        })

        createBtn.addEventListener("click", async () => {

            const newPerson = {
                name: name.value,
                last_name: last_name.value
            }

            await endpoints.create(newPerson)
            const dataWithNewPerson = await endpoints.getAll()
            await showData(dataWithNewPerson)
        })

    }

    function deleteHandler() {
        const deleteBtn = document.getElementById("btnDelete");
        const deleteInput = document.getElementById('inputDelete');

        deleteInput.addEventListener('input', (e) => {
            if (!e.target.value) {
                deleteBtn.disabled = true
            } else {
                deleteBtn.disabled = false
            }
        })

        deleteBtn.addEventListener('click', async () => {
            const id = deleteInput.value

            if (!id) return

            const del = await endpoints.delete(id);
            if (!del) {
                showAlert(del)
                return;
            }
            const dataAfterDelete = await endpoints.getAll()
            await showData(dataAfterDelete)
        })
    }

    function updateHandler() {
        const updateBtn = document.getElementById('btnPut');
        const inputPutId = document.getElementById('inputPutId')
        const sendChangesBtn = document.getElementById('btnSendChanges');
        const id = document.getElementById("inputPutId")
        let currentData = {}
        let status = ''

        inputPutId.addEventListener('input', async (e) => {
            if (!e.target.value) {
                updateBtn.disabled = true
                updateBtn.removeAttribute('data-bs-toggle', "modal")
                updateBtn.removeAttribute('data-bs-target', "#dataModal")
                return;
            }
            updateBtn.disabled = false
            const data = await endpoints.getById(id.value);
            status = data
            if (!data) {
                updateBtn.removeAttribute('data-bs-toggle', "modal")
                updateBtn.removeAttribute('data-bs-target', "#dataModal")
                return;
            }
            currentData = {
                ...data
            }
            updateBtn.setAttribute('data-bs-toggle', "modal")
            updateBtn.setAttribute('data-bs-target', "#dataModal")
        })

        updateBtn.addEventListener("click", async (e) => {
            const name = document.getElementById("inputPutNombre")
            const last_name = document.getElementById("inputPutApellido")

            if (!status) showAlert(status)
            if (!currentData) return;

            name.value = currentData.name
            last_name.value = currentData.last_name
            sendChangesBtn.addEventListener('click', async () => {
                const dataToUpdate = {
                    name: name.value,
                    last_name: last_name.value
                }
                await endpoints.update(id.value, dataToUpdate)

                const dataAfterUpdate = await endpoints.getAll()
                await showData(dataAfterUpdate)
            })
        })
    }

    createHandler()
    deleteHandler()
    updateHandler()
    getAllHandler()
}

async function showData(data) {
    const result = document.getElementById('results')
    const dataTemlpate = data.map(elem => (
        `
            <li>
                <small>ID: ${elem.id}</small>
                <br/>
                <small>NAME: ${elem.name}</small>
                <br/>
                <small>LASNAME: ${elem.last_name}</small>
            </li>
        `
    ))
    result.innerHTML = dataTemlpate
}
