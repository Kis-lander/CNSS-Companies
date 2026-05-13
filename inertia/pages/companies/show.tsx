import { usePage } from '@inertiajs/react'
import { useEffect, useRef } from 'react'
import { Data } from '@generated/data'

type Company = {
  id: number
  name: string
  address: string
  phone: string | null
  affiliationNumber: string | null
  image: string | null
  latitude: number | string | null
  longitude: number | string | null
}

type CompaniesShowProps = {
  company: Company
}

type MapLibreMap = {
  addControl: (control: unknown, position?: string) => void
  getStyle: () => { layers?: Array<MapStyleLayer> }
  on: (event: 'load', callback: () => void) => void
  remove: () => void
  resize: () => void
  setLayoutProperty: (layerId: string, name: string, value: unknown) => void
  setPaintProperty: (layerId: string, name: string, value: unknown) => void
}

type MapStyleLayer = {
  id: string
  type?: string
  layout?: {
    'text-field'?: unknown
  }
}

type MapLibreStatic = {
  Map: new (options: {
    center: [number, number]
    container: HTMLDivElement
    style: string
    zoom: number
  }) => MapLibreMap
  Marker: new (options?: { color?: string }) => {
    addTo: (map: MapLibreMap) => MapLibreMarker
    setLngLat: (coordinates: [number, number]) => MapLibreMarker
    setPopup: (popup: unknown) => MapLibreMarker
    togglePopup: () => MapLibreMarker
  }
  NavigationControl: new (options?: { showCompass?: boolean }) => unknown
  Popup: new (options?: { maxWidth?: string; offset?: number }) => {
    setHTML: (content: string) => unknown
  }
}

type MapLibreMarker = InstanceType<MapLibreStatic['Marker']>

declare global {
  interface Window {
    maplibregl?: MapLibreStatic
  }
}

function escapeHtml(value: string) {
  return value.replace(/[&<>"']/g, (character) => {
    const entities: Record<string, string> = {
      '&': '&amp;',
      '<': '&lt;',
      '>': '&gt;',
      '"': '&quot;',
      "'": '&#039;',
    }

    return entities[character]
  })
}

function loadMapLibre() {
  if (window.maplibregl) {
    return Promise.resolve()
  }

  return new Promise<void>((resolve, reject) => {
    const existingScript = document.querySelector<HTMLScriptElement>('script[data-maplibre]')

    if (existingScript) {
      existingScript.addEventListener('load', () => resolve(), { once: true })
      existingScript.addEventListener('error', () => reject(), { once: true })
      return
    }

    const stylesheet = document.createElement('link')
    stylesheet.rel = 'stylesheet'
    stylesheet.href = 'https://unpkg.com/maplibre-gl@5.9.0/dist/maplibre-gl.css'
    document.head.appendChild(stylesheet)

    const script = document.createElement('script')
    script.src = 'https://unpkg.com/maplibre-gl@5.9.0/dist/maplibre-gl.js'
    script.dataset.maplibre = 'true'
    script.onload = () => resolve()
    script.onerror = () => reject()
    document.body.appendChild(script)
  })
}

function makeRoadLabelsReadable(map: MapLibreMap) {
  const roadLabelIds =
    map
      .getStyle()
      .layers?.filter((layer) => {
        const id = layer.id.toLowerCase()

        return (
          layer.type === 'symbol' &&
          Boolean(layer.layout?.['text-field']) &&
          (id.includes('road') ||
            id.includes('street') ||
            id.includes('highway') ||
            id.includes('transport') ||
            id.includes('minor') ||
            id.includes('major'))
        )
      })
      .map((layer) => layer.id) ?? []

  roadLabelIds.forEach((layerId) => {
    map.setLayoutProperty(layerId, 'text-size', [
      'interpolate',
      ['linear'],
      ['zoom'],
      10,
      12,
      12,
      14,
      14,
      17,
      16,
      20,
      18,
      23,
    ])
    map.setPaintProperty(layerId, 'text-color', '#4b5563')
    map.setPaintProperty(layerId, 'text-halo-color', '#ffffff')
    map.setPaintProperty(layerId, 'text-halo-width', 1.6)
    map.setPaintProperty(layerId, 'text-halo-blur', 0.15)
  })
}

function popupContent(company: Company) {
  const image = company.image
    ? `<img class="company-popup-image" src="${escapeHtml(company.image)}" alt="${escapeHtml(company.name)}" />`
    : '<div class="company-popup-placeholder">Image</div>'

  return `
    <div class="company-popup">
      ${image}
      <strong>${escapeHtml(company.name)}</strong>
      <span>${escapeHtml(company.address)}</span>
      ${company.affiliationNumber ? `<span>${escapeHtml(company.affiliationNumber)}</span>` : ''}
      ${company.phone ? `<span>${escapeHtml(company.phone)}</span>` : ''}
    </div>
  `
}

export default function CompaniesShow({ company }: CompaniesShowProps) {
  const page = usePage<
    Data.SharedProps & { user?: Data.SharedProps['user'] & { canManageCompanies?: boolean } }
  >()
  const mapContainer = useRef<HTMLDivElement | null>(null)
  const canManageCompanies = Boolean(page.props.user?.canManageCompanies)
  const latitude = company.latitude === null ? null : Number(company.latitude)
  const longitude = company.longitude === null ? null : Number(company.longitude)
  const hasCoordinates =
    latitude !== null &&
    longitude !== null &&
    Number.isFinite(latitude) &&
    Number.isFinite(longitude)

  useEffect(() => {
    let map: MapLibreMap | null = null
    let disposed = false

    if (!hasCoordinates) {
      return () => {}
    }

    loadMapLibre().then(() => {
      if (
        disposed ||
        !mapContainer.current ||
        !window.maplibregl ||
        latitude === null ||
        longitude === null
      ) {
        return
      }

      const maplibregl = window.maplibregl
      const coordinates: [number, number] = [longitude, latitude]

      map = new maplibregl.Map({
        center: coordinates,
        container: mapContainer.current,
        style: 'https://tiles.openfreemap.org/styles/liberty',
        zoom: 13.2,
      })
      map.addControl(new maplibregl.NavigationControl({ showCompass: false }), 'top-left')
      map.on('load', () => {
        if (!map) {
          return
        }

        makeRoadLabelsReadable(map)
        map.resize()
      })

      const popup = new maplibregl.Popup({ maxWidth: '280px', offset: 28 }).setHTML(
        popupContent(company)
      )
      const marker = new maplibregl.Marker({ color: '#2f7fbd' })
        .setLngLat(coordinates)
        .setPopup(popup)
        .addTo(map)
      marker.togglePopup()
    })

    return () => {
      disposed = true
      map?.remove()
    }
  }, [company, hasCoordinates, latitude, longitude])

  return (
    <div className="companies-page">
      <section className="companies-toolbar">
        <div>
          <p className="eyebrow">Localisation</p>
          <h1>{company.name}</h1>
        </div>
        <div className="toolbar-actions">
          <a href="/companies" className="button-link">
            Retour à la liste
          </a>
          {canManageCompanies && (
            <>
              <a
                href={`/companies/${company.id}/edit`}
                className="button-link button-link-secondary"
              >
                Modifier
              </a>
              <a href="/companies/create" className="button-link button-link-secondary">
                Nouvelle entreprise
              </a>
            </>
          )}
        </div>
      </section>

      <section className="company-detail">
        <aside className="company-detail-panel">
          {company.image ? (
            <img src={company.image} alt={company.name} />
          ) : (
            <div className="company-detail-placeholder">Image</div>
          )}
          <div>
            <h2>{company.name}</h2>
            <p>{company.address}</p>
            {company.affiliationNumber && <p>{company.affiliationNumber}</p>}
            {company.phone && <p>{company.phone}</p>}
            <span>
              {hasCoordinates
                ? `${latitude!.toFixed(5)}, ${longitude!.toFixed(5)}`
                : 'Coordonnées en attente'}
            </span>
          </div>
        </aside>

        <section className="map-panel company-location-map">
          {hasCoordinates ? (
            <div ref={mapContainer} className="companies-map" />
          ) : (
            <div className="map-empty">Aucune coordonnée disponible pour cette entreprise.</div>
          )}
        </section>
      </section>
    </div>
  )
}
