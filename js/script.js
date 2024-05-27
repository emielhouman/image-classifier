let currentImg;

const video = document.querySelector('.video');
const canvas = document.createElement('canvas');
const result = document.querySelector('.result');
const captureBtn = document.querySelector('.classifier__btn');
const loader = document.querySelector('.classifier__loader');

navigator.mediaDevices.getUserMedia({ video: true })
  .then(stream => {
    video.srcObject = stream;
    video.play();
  })
  .catch(err => {
    console.error('Error accessing the webcam:', err);
  });

function classifyImage(img) {
  const classifier = ml5.imageClassifier('MobileNet', () => {
    classifier.classify(img, (err, results) => {
      if (err) {
        console.error('Error classifying image:', err);
        result.innerText = 'Error classifying image';
      } else {
        console.log(results);
        result.innerText = `${results[0].label} (${Math.floor(results[0].confidence * 100)}%)`;
      }
      loader.style.display = 'none';
    });
  });
}

function captureImage() {
  loader.style.display = 'block';
  canvas.width = video.videoWidth;
  canvas.height = video.videoHeight;
  const context = canvas.getContext('2d');
  context.drawImage(video, 0, 0, canvas.width, canvas.height);

  const imgUrl = canvas.toDataURL('image/jpeg');

  if (currentImg) {
    currentImg.remove();
  }

  const img = new Image();
  img.onload = function () {
    classifyImage(img);
    currentImg = img;
  };
  img.src = imgUrl;
}

captureBtn.addEventListener('click', captureImage);