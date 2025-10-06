document.addEventListener('DOMContentLoaded', () => {
    document.body.classList.add('app-page');

    const loggedInUser = sessionStorage.getItem('loggedInUser');
    const userEmailElement = document.getElementById('userEmail');
    
    if (!loggedInUser) {
        window.location.href = 'index.html';
        return;
    }
    
    userEmailElement.textContent = loggedInUser;

    const logoutButton = document.getElementById('logoutButton');
    logoutButton.addEventListener('click', () => {
        sessionStorage.removeItem('loggedInUser');
        window.location.href = 'index.html';
    });

    const vehicleForm = document.getElementById('vehicleForm');
    const vehicleTableBody = document.querySelector('#vehicleTable tbody');
    const formButton = document.getElementById('formButton');
    const cancelEditButton = document.getElementById('cancelEditButton');
    
    let vehicles = JSON.parse(localStorage.getItem('vehicle_app_data')) || [];

    const renderTable = () => {
        vehicleTableBody.innerHTML = '';
        vehicles.forEach(vehicle => {
            const row = document.createElement('tr');
            
            // Lógica para exibir a imagem ou um placeholder
            const imageUrl = vehicle.imageUrl || 'https://via.placeholder.com/120x70?text=Sem+Foto';

            row.innerHTML = `
                <td>
                    <img src="${imageUrl}" alt="${vehicle.brand} ${vehicle.model}" class="vehicle-photo" onerror="this.onerror=null;this.src='https://via.placeholder.com/120x70?text=Erro';">
                </td>
                <td>${vehicle.brand}</td>
                <td>${vehicle.model}</td>
                <td>${vehicle.year}</td>
                <td>
                    <button class="button-edit" data-id="${vehicle.id}">Editar</button>
                    <button class="button-delete" data-id="${vehicle.id}">Excluir</button>
                </td>
            `;
            vehicleTableBody.appendChild(row);
        });
    };

    const saveData = () => {
        localStorage.setItem('vehicle_app_data', JSON.stringify(vehicles));
    };
    
    const resetForm = () => {
        vehicleForm.reset();
        document.getElementById('vehicleId').value = '';
        formButton.textContent = 'Cadastrar Veículo';
        cancelEditButton.style.display = 'none';
    };

    vehicleForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const id = document.getElementById('vehicleId').value;
        const brand = document.getElementById('vehicleBrand').value;
        const model = document.getElementById('vehicleModel').value;
        const year = document.getElementById('vehicleYear').value;
        const imageUrl = document.getElementById('vehicleImageUrl').value; // Pega o valor da URL

        if (id) {
            const vehicleIndex = vehicles.findIndex(v => v.id == id);
            if (vehicleIndex !== -1) {
                // Atualiza o veículo incluindo a URL da imagem
                vehicles[vehicleIndex] = { id: parseInt(id), brand, model, year, imageUrl };
            }
        } else {
            const newVehicle = {
                id: Date.now(),
                brand,
                model,
                year,
                imageUrl // Adiciona a URL da imagem ao novo veículo
            };
            vehicles.push(newVehicle);
        }
        
        saveData();
        renderTable();
        resetForm();
    });

    vehicleTableBody.addEventListener('click', (e) => {
        const target = e.target;
        const id = target.getAttribute('data-id');

        if (target.classList.contains('button-delete')) {
            if (confirm('Tem certeza que deseja excluir este veículo?')) {
                vehicles = vehicles.filter(vehicle => vehicle.id != id);
                saveData();
                renderTable();
            }
        }

        if (target.classList.contains('button-edit')) {
            const vehicle = vehicles.find(v => v.id == id);
            if (vehicle) {
                document.getElementById('vehicleId').value = vehicle.id;
                document.getElementById('vehicleBrand').value = vehicle.brand;
                document.getElementById('vehicleModel').value = vehicle.model;
                document.getElementById('vehicleYear').value = vehicle.year;
                document.getElementById('vehicleImageUrl').value = vehicle.imageUrl || ''; // Preenche o campo da imagem
                
                formButton.textContent = 'Salvar Alterações';
                cancelEditButton.style.display = 'inline-block';
                window.scrollTo(0, 0);
            }
        }
    });
    
    cancelEditButton.addEventListener('click', resetForm);

    renderTable();
});