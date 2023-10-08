const imagesWrapper = document.querySelector(".images");
const loadMoreButton = document.querySelector(".load-more");
const searchInput = document.querySelector(".search-box input");
const lightBox = document.querySelector(".lightbox");
const closeBtn = lightBox.querySelector(".uil-times");
const downloadImgButton = document.querySelector(".uil-import");

const apiKey = "mGqa9XrgjyEI66eouqwXXmT1dMFAL6v9tRKTYgvU3rFyphXAnlcgbaQh";
const perPage = 15;
let currentPage = 1;
let searchTerm = null;

const downloadImg = (imgURL) => {
  fetch(imgURL)
    .then((res) => res.blob())
    .then((file) => {
      console.log(file);
      const a = document.createElement("a");
      a.href = URL.createObjectURL(file);
      a.download = new Date().getTime();
      a.click();
    })
    .catch(() => alert("failed to download image"));
};

const showLightbox = (name, img) => {
  lightBox.querySelector("img").src = img;
  lightBox.querySelector("span").innerText = name;
  downloadImgButton.setAttribute("data-img", img);
  lightBox.classList.add("show");
  document.body.style.overflow = "hidden";
};

const hideLightbox = () => {
  lightBox.classList.remove("show");
  document.body.style.overflow = "auto";
};

const generateHTML = (images) => {
  imagesWrapper.innerHTML += images
    .map(
      (img) =>
        `<li class="card" onClick = "showLightbox('${img.photographer}','${img.src.large2x}')">
        <img src="${img.src.large2x}" alt="img" />
        <div class="details">
          <div class="photographer">
            <i class="uil uil-camera"></i>
            <span>${img.photographer}</span>
          </div>
          <button onclick="downloadImg('${img.src.large2x}'); event.stopPropagation();"><i class="uil uil-import"></i></button>
        </div>
      </li>`
    )
    .join("");
};

const getImages = (apiURL) => {
  loadMoreButton.innerText = "Loading...";
  loadMoreButton.classList.add("disabled");

  fetch(apiURL, {
    headers: { Authorization: apiKey },
  })
    .then((res) => res.json())
    .then((res) => {
      //   console.log(res);
      generateHTML(res.photos);
      loadMoreButton.innerText = "Load More";
      loadMoreButton.classList.remove("disabled");
    })
    .catch(() => alert("failed to load images"));
};

const loadMoreImages = () => {
  currentPage++;
  let apiURL = `https://api.pexels.com/v1/curated?page=${currentPage}&per_page=${perPage}`;
  apiURL = searchTerm
    ? `https://api.pexels.com/v1/search?query=${searchTerm}&page=${currentPage}&per_page=${perPage}`
    : apiURL;
  getImages(apiURL);
};

const loadSearchImages = (e) => {
  if (e.target.value === "") {
    return (searchTerm = null);
  }

  if (e.key === "Enter") {
    currentPage = 1;
    searchTerm = e.target.value;
    imagesWrapper.innerHTML = "";
    getImages(
      `https://api.pexels.com/v1/search?query=${searchTerm}&page=${currentPage}&per_page=${perPage}`
    );
  }
};

getImages(
  `https://api.pexels.com/v1/curated?page=${currentPage}&per_page=${perPage}`
);

document.addEventListener("click", loadMoreImages);
searchInput.addEventListener("keyup", loadSearchImages);
closeBtn.addEventListener("click", hideLightbox);
downloadImgButton.addEventListener("click", (e) =>
  downloadImg(e.target.dataset.img)
);
