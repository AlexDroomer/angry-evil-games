const staticCacheName = 's-app-v3'
const dynamicCacheName = 'd-app-v3'

const assetUrls = [
    '/index.html',
    '/cards/card-1.html',
    '/cards/card-2.html',
    '/css/styles.css',
    '/offline.html',
    '/android-chrome-192x192.png',
    '/favicon-32x32.png',
    '/icons/mail.svg',
    '/icons/geo.svg',
    '/icons/phone.svg',
    '/icons/share.svg',
    '/icons/tg.svg',
    '/images/bg-card.png',
    '/images/heading-border-effect.png	',
    '/images/logo.png',
    '/js/app.js',
    '/manifest.json'
]

self.addEventListener('install', async event => {
  const cache = await caches.open(staticCacheName)
  await cache.addAll(assetUrls)
})

self.addEventListener('activate', async event => {
  const cacheNames = await caches.keys()
  await Promise.all(
    cacheNames
      .filter(name => name !== staticCacheName)
      .filter(name => name !== dynamicCacheName)
      .map(name => caches.delete(name))
  )
})

self.addEventListener('fetch', event => {
  const {request} = event

  const url = new URL(request.url)
  if (url.origin === location.origin) {
    event.respondWith(cacheFirst(request))
  } else {
    event.respondWith(networkFirst(request))
  }
})


async function cacheFirst(request) {
  const cached = await caches.match(request)
  return cached ?? await fetch(request)
}

async function networkFirst(request) {
  const cache = await caches.open(dynamicCacheName)
  try {
    const response = await fetch(request)
    await cache.put(request, response.clone())
    return response
  } catch (e) {
    const cached = await cache.match(request)
    return cached ?? await caches.match('/offline.html')
  }
}
