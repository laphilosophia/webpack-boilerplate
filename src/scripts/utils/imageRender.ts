import { Cloudinary } from 'cloudinary-core'

const cdn = new Cloudinary({
  api_key: '287279534649789',
  api_secret: '-zHmGrR-zV49gqk_YN3EorCQbG8',
  cloud_name: "erdemarslan",
  secure: true
});

export default function imageRender (target: Element | null, publicId: string, alt?: string) {
  function loadImage(URL: string) {
    return new Promise((resolve, reject) => {
      let img = new Image()

      img.addEventListener('load', e => resolve(img))
      img.addEventListener('error', () => {
        reject(new Error(`Failed to load image's URL: ${URL}`))
      })

      img.src = cdn.url(URL)
      img.decoding = 'async'
      img.alt = (alt as any)
    })
  }

  loadImage(publicId)
    .then(img => target?.appendChild((img as any)))
    .catch(err => console.error(err))
}


// @usage:
// imageRender(
//   document.getElementById('sample-id'),
//   'sample/sample-tag',
//   'Sample Alt String'
// )
