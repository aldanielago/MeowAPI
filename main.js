//Declaración de constantes
const API_KEY = 'live_pyoJcrQ02wLZscLfTMQoB8qTi96RDbMgnsvVrpwaKqxZb3WHst2861u8QH0YUfA1';
const API_RAM = 'https://api.thecatapi.com/v1/images/search?limit=3';
const API_FAV = 'https://api.thecatapi.com/v1/favourites';
const API_ADD = 'https://api.thecatapi.com/v1/images/upload';
const API_DEL = (id) => `https://api.thecatapi.com/v1/favourites/${id}`

const img1_ram = document.getElementById('img1-ram');
const img2_ram = document.getElementById('img2-ram');
const img3_ram = document.getElementById('img3-ram');

const like_1 = document.getElementById('cat1-ram');
const like_2 = document.getElementById('cat2-ram');
const like_3 = document.getElementById('cat3-ram');
const k_saved = document.getElementById('kittens-saved');

const btn = document.getElementById('btn_random')
const form = document.getElementById('upload-form');
const file_input = document.getElementById('file');
const btn_agregar = document.getElementById('upload-photo');
const preview_container = document.getElementById('preview-container');

const Toast = Swal.mixin({
	toast: true,
	showConfirmButton: false,
	timer: 2000,
	timerProgressBar: true,
	didOpen: (toast) => {
		toast.addEventListener("mouseenter", Swal.stopTimer);
		toast.addEventListener("mouseleave", Swal.resumeTimer);
	},
});

//Eventos
btn.addEventListener('click', loadRandomMichis);
btn_agregar.addEventListener('click', uploadPhotoMichi);
k_saved.addEventListener('click', function(event) {
	if (event.target.classList.contains('bi-heart-fill')) {
		const id = event.target.closest('.michi-container').getAttribute('data-id');
		deleteFavoriteMichi(id, event.target);
	}
});
file_input.addEventListener('change', () => {
  if (file_input.files.length > 0) {
		const file_reader = new FileReader();

    file_reader.addEventListener('load', () => {
      const img = document.createElement('img');
      img.src = file_reader.result;
			img.id = 'preview-img';
      preview_container.innerHTML = '';
      preview_container.appendChild(img);
      btn_agregar.style.display = 'flex';
    });

    file_reader.readAsDataURL(file_input.files[0]);
  } else {
		preview_container.innerHTML = '';
    btn_agregar.style.display = 'none';
  }
});

//Funciones de carga
async function loadRandomMichis(){
	const response = await fetch(API_RAM);
	const data = await response.json();

	if(response.status >= 200 && response.status < 300){
		img1_ram.src = data[0].url;
		img2_ram.src = data[1].url;
		img3_ram.src = data[2].url;
	}
	else {
		Toast.fire({
			icon: "error",
			title: "Something went wrong" + response.status,
			text: response.message,
		})
	}

	like_1.onclick = () => saveFavoriteMichi(data[0].id, like_1);
	like_2.onclick = () => saveFavoriteMichi(data[1].id, like_2);
	like_3.onclick = () => saveFavoriteMichi(data[2].id, like_3);
};

async function loadFavoriteMichis(){
	const response = await fetch(API_FAV, {
		method: 'GET',
		headers: {
			'x-api-key': API_KEY,
		}
	});

	const data = await response.json();

	if(response.status >= 200 && response.status < 300){
		k_saved.innerHTML = '';
		data.forEach(michi => {
			const content = `
				<div class="michi-container" data-id="${michi.id}">
					<img src="${michi.image.url}" id="${michi.id}" alt="Kitten">
					<span class="icon"><i id="cat${michi.id}_ram" class="bi bi-heart-fill"></i></span>
				</div>
			`
			k_saved.innerHTML += content;

			const dislike = document.getElementById(`cat${michi.id}_ram`)
			dislike.onclick = () => deleteFavoriteMichi(michi.id, dislike);
		});
	}
	else {
		Toast.fire({
			icon: "error",
			title: "Something went wrong" + response.message,
			text: response.message,
		})
	}
}

// Interacción con la API
async function uploadPhotoMichi(){
	const preview_img = document.getElementById('preview-img');
	const form_data = new FormData(form);
	const res = await fetch(API_ADD, {
		method: 'POST',
		headers: {
			"x-api-key": API_KEY,
		},
		body: form_data,
	});
	const data = await res.json();

	if(res.status < 200 && res.status >= 300){
		Toast.fire({
			icon: "error",
			title: "Something went wrong" + res.message,
		})
	}
	else {
		saveFavoriteMichi(data.id, data.url)
		form.reset();
		preview_img.style.display = 'none';
		btn_agregar.style.display = 'none';
		Toast.fire({
			icon: "success",
			title: "¡Your kitten was added! 🐱",
		})
	}
}

async function saveFavoriteMichi(id, element){
	const response = await fetch(API_FAV, {
		method: 'POST',
		headers: {
			"x-api-key": API_KEY,
			'Content-Type': 'application/json',
		},
		body: JSON.stringify({
			image_id: id,
		}),
	});

	if(response.status < 200 && response.status >= 300){
		Toast.fire({
			icon: "error",
			title: "Something went wrong 😞" + response.status,
		})
	}
	else {
		Toast.fire({
			icon: "success",
			title: "¡Kitten added to favorites! 😁",
		})
		loadFavoriteMichis();
		element.classList.remove('bi-heart');
		element.classList.add('bi-heart-fill');
	}
}

async function deleteFavoriteMichi(id, element){
	const response = await fetch(API_DEL(id) , {
		method: 'DELETE',
		headers: {
			"x-api-key": API_KEY,
		},
	})

	if(response.status < 200 && response.status >= 300){
		Toast.fire({
			icon: "error",
			title: "Something went wrong 😞" + response.message,
		})
	}
	else {
		loadFavoriteMichis();
		Toast.fire({
			icon: "success",
			title: "Kitten successfully removed 😉",
		})
	}

	element.classList.remove('bi-heart-fill');
	element.classList.add('bi-heart');
}

loadRandomMichis();
loadFavoriteMichis();
