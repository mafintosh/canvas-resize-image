module.exports = async function resize (base64, { width = 112, height = 112, url = base64.startsWith('data:') } = {}) {
  const canvas = new OffscreenCanvas(width, height)
  const context = canvas.getContext('2d')

  const image = new Image()

  await new Promise((resolve, reject) => {
    image.onerror = reject
    image.onload = resolve
    image.src = base64.startsWith('data:') ? base64 : 'data:;base64,' + base64
  })

  const aspect = image.width / image.height
  let x = 0
  let y = 0
  let w = canvas.width
  let h = canvas.height
  if (aspect > 1) {
    x = (canvas.width - canvas.width * aspect) / 2
    w *= aspect
  } else if (aspect < 1) {
    y = (canvas.height - canvas.height / aspect) / 2
    h /= aspect
  }
  context.drawImage(image, x, y, w, h)
  const blob = await canvas.convertToBlob({ type: 'image/webp' })
  const reader = new FileReader()
  await new Promise((resolve) => {
    reader.onloadend = resolve
    reader.readAsDataURL(blob)
  })
  return url ? reader.result : reader.result.slice(reader.result.indexOf(',') + 1)
}
