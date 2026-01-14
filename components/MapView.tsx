'use client';

import React, { useEffect, useRef, useState, useImperativeHandle, forwardRef } from 'react';
import maplibregl from 'maplibre-gl';
import * as turf from '@turf/turf';
import {
  Maximize2,
  Layers,
  MousePointer2,
  Hexagon,
  Plus,
  Minus,
  Navigation,
  Box,
  Loader2,
  AlertCircle,
  Eye,
  Info,
  Map as MapIcon,
  Pentagon,
  Trash2,
  Undo2,
  Crosshair
} from 'lucide-react';

interface MapViewProps {
  className?: string;
  isWizard?: boolean;
  onAreaSelected?: (area: number, geojson?: GeoJSON.Feature) => void;
  onLocationChange?: (lat: number, lon: number) => void;
  initialGeoJSON?: GeoJSON.Feature | null;
}

export interface MapViewRef {
  flyTo: (lat: number, lon: number, bounds?: [number, number, number, number]) => void;
  loadGeoJSON: (geojson: GeoJSON.Feature | GeoJSON.FeatureCollection) => void;
  clearAOI: () => void;
}

const MapView = forwardRef<MapViewRef, MapViewProps>(({ className = "", isWizard = false, onAreaSelected, onLocationChange, initialGeoJSON = null }, ref) => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const mapInstance = useRef<maplibregl.Map | null>(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [useSimulation, setUseSimulation] = useState(false);
  const [activeTool, setActiveTool] = useState<'hand' | 'box' | 'polygon'>('hand');
  const activeToolRef = useRef<'hand' | 'box' | 'polygon'>('hand'); // Track current tool for event listeners
  const [polygonVertices, setPolygonVertices] = useState<[number, number][]>([]);
  const tempVerticesRef = useRef<[number, number][]>([]); // Track vertices in event listeners
  const polygonHistoryRef = useRef<Array<[number, number][]>>([]); // Track history for undo
  const [currentGeoJSON, setCurrentGeoJSON] = useState<GeoJSON.Feature | null>(null);
  const [isLocating, setIsLocating] = useState(false);

  //Geolocation handler
  const handleLocate = () => {
    if (!mapInstance.current) return;

    setIsLocating(true);
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          if (mapInstance.current) {
            mapInstance.current.flyTo({
              center: [longitude, latitude],
              zoom: 14,
              duration: 1500
            });

            // Add a marker at the user's location (optional)
            const marker = new maplibregl.Marker({ color: '#6366f1' })
              .setLngLat([longitude, latitude])
              .addTo(mapInstance.current);

            setTimeout(() => marker.remove(), 3000); // Remove after 3 seconds
          }
          setIsLocating(false);
        },
        (error) => {
          console.error('Geolocation error:', error);
          alert('Unable to get your location. Please check your browser permissions.');
          setIsLocating(false);
        },
        {
          enableHighAccuracy: true,
          timeout: 5000,
          maximumAge: 0
        }
      );
    } else {
      alert('Geolocation is not supported by your browser.');
      setIsLocating(false);
    }
  };

  // Keep ref in sync with state
  useEffect(() => {
    activeToolRef.current = activeTool;

    // Update cursor when tool changes
    if (mapInstance.current && isLoaded) {
      const canvas = mapInstance.current.getCanvas();
      const map = mapInstance.current;

      console.log('Tool changed to:', activeTool);

      if (activeTool === 'hand') {
        canvas.style.cursor = '';
        // Enable drag pan
        if (map.dragPan) {
          map.dragPan.enable();
          console.log('DragPan enabled');
        }
      } else if (activeTool === 'box' || activeTool === 'polygon') {
        canvas.style.cursor = 'crosshair';
        // Disable drag pan to prevent map scrolling
        if (map.dragPan) {
          map.dragPan.disable();
          console.log('DragPan disabled for', activeTool);
        }
      }
    }
  }, [activeTool, isLoaded]);

  // Undo function for polygon drawing
  const handleUndo = () => {
    if (polygonHistoryRef.current.length > 1) {
      // Remove current state
      polygonHistoryRef.current.pop();
      // Get previous state
      const previousState = polygonHistoryRef.current[polygonHistoryRef.current.length - 1];
      tempVerticesRef.current = [...previousState];
      setPolygonVertices([...previousState]);

      // Update map display
      if (mapInstance.current) {
        const source = mapInstance.current.getSource('aoi-results') as maplibregl.GeoJSONSource;
        if (previousState.length >= 3) {
          const closedCoords = [...previousState, previousState[0]];
          source.setData({
            type: 'Feature',
            geometry: { type: 'Polygon', coordinates: [closedCoords] },
            properties: {}
          });
        } else if (previousState.length === 2) {
          source.setData({
            type: 'Feature',
            geometry: { type: 'LineString', coordinates: previousState },
            properties: {}
          });
        } else {
          source.setData({ type: 'FeatureCollection', features: [] });
        }
      }
    }
  };

  // Keyboard listener for Ctrl+Z / Cmd+Z
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'z' && activeToolRef.current === 'polygon' && polygonVertices.length > 0) {
        e.preventDefault();
        handleUndo();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [polygonVertices]);

  useEffect(() => {
    if (!mapContainer.current) return;

    const initMap = () => {
      try {
        // Basic check for WebGL support
        const canvas = document.createElement('canvas');
        const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
        if (!gl) {
          throw new Error("WebGL not supported");
        }

        // MapLibre sometimes tries to access location.href which fails in some sandboxed environments.
        // We wrap the instantiation in a try-catch.
        mapInstance.current = new maplibregl.Map({
          container: mapContainer.current!,
          style: {
            version: 8,
            sources: {
              'streets': {
                type: 'raster',
                tiles: [
                  'https://server.arcgisonline.com/ArcGIS/rest/services/World_Street_Map/MapServer/tile/{z}/{y}/{x}'
                ],
                tileSize: 256,
                attribution: 'Esri'
              }
            },
            layers: [
              {
                id: 'streets-layer',
                type: 'raster',
                source: 'streets',
                minzoom: 0,
                maxzoom: 19
              }
            ]
          },
          center: [-74.006, 40.7128],
          zoom: 12,
          pitch: 0,
          bearing: 0,
          doubleClickZoom: false // Disable to allow polygon double-click completion
        });

        // Update cursor based on active tool
        const updateCursor = () => {
          if (!mapInstance.current) return;
          const canvas = mapInstance.current.getCanvas();

          if (activeToolRef.current === 'hand') {
            canvas.style.cursor = '';
          } else if (activeToolRef.current === 'box' || activeToolRef.current === 'polygon') {
            canvas.style.cursor = 'crosshair';
          }
        };

        mapInstance.current.on('load', () => {
          setIsLoaded(true);
          if (!mapInstance.current) return;

          // Initialize GeoJSON source for AOI (both wizard and results view)
          mapInstance.current.addSource('aoi-results', {
            type: 'geojson',
            data: {
              type: 'FeatureCollection',
              features: []
            }
          });

          mapInstance.current.addLayer({
            id: 'aoi-fill',
            type: 'fill',
            source: 'aoi-results',
            paint: { 'fill-color': '#6366f1', 'fill-opacity': 0.2 }
          });

          mapInstance.current.addLayer({
            id: 'aoi-outline',
            type: 'line',
            source: 'aoi-results',
            paint: { 'line-color': '#4f46e5', 'line-width': 2 }
          });

          // Load initial GeoJSON for non-wizard maps (e.g., processing screen, dashboard)
          if (!isWizard && initialGeoJSON) {
            const source = mapInstance.current.getSource('aoi-results') as maplibregl.GeoJSONSource;
            if (source) {
              source.setData(initialGeoJSON);
              // Fit map to AOI bounds
              const bounds = new maplibregl.LngLatBounds();
              if (initialGeoJSON.geometry.type === 'Polygon') {
                initialGeoJSON.geometry.coordinates[0].forEach((coord: number[]) => {
                  bounds.extend(coord as [number, number]);
                });
                mapInstance.current.fitBounds(bounds, { padding: 20, duration: 0 });
              }
            }
          }

          // Add interactive drawing (box and polygon modes)
          let startPoint: [number, number] | null = null;
          let isDragging = false;

          mapInstance.current.on('mousedown', (e) => {
            console.log('Mouse down event fired, current tool:', activeToolRef.current);
            if (activeToolRef.current === 'box') {
              console.log('Starting box draw at:', e.lngLat);
              isDragging = true;
              startPoint = [e.lngLat.lng, e.lngLat.lat];
              mapInstance.current!.getCanvas().style.cursor = 'crosshair';
            }
          });

          mapInstance.current.on('mousemove', (e) => {
            if (isDragging && startPoint && activeToolRef.current === 'box') {
              const endPoint: [number, number] = [e.lngLat.lng, e.lngLat.lat];
              const box = [
                [startPoint[0], startPoint[1]],
                [endPoint[0], startPoint[1]],
                [endPoint[0], endPoint[1]],
                [startPoint[0], endPoint[1]],
                [startPoint[0], startPoint[1]]
              ];

              const source = mapInstance.current!.getSource('aoi-results') as maplibregl.GeoJSONSource;
              source.setData({
                type: 'Feature',
                geometry: {
                  type: 'Polygon',
                  coordinates: [box]
                },
                properties: {}
              });
            }
          });

          mapInstance.current.on('mouseup', (e) => {
            if (isDragging && startPoint && activeToolRef.current === 'box') {
              isDragging = false;
              const endPoint: [number, number] = [e.lngLat.lng, e.lngLat.lat];
              const box = [
                [startPoint[0], startPoint[1]],
                [endPoint[0], startPoint[1]],
                [endPoint[0], endPoint[1]],
                [startPoint[0], endPoint[1]],
                [startPoint[0], startPoint[1]]
              ];

              const feature: GeoJSON.Feature = {
                type: 'Feature',
                geometry: {
                  type: 'Polygon',
                  coordinates: [box]
                },
                properties: {}
              };

              const source = mapInstance.current!.getSource('aoi-results') as maplibregl.GeoJSONSource;
              source.setData(feature);

              // Calculate area using turf
              if (isWizard && onAreaSelected) {
                const area = turf.area(feature) / 1_000_000; // Convert to km²
                setCurrentGeoJSON(feature);
                onAreaSelected(Math.round(area * 100) / 100, feature);
              }

              mapInstance.current!.getCanvas().style.cursor = '';
              startPoint = null;
            }
          });

          // Polygon drawing with click-to-add-vertex
          mapInstance.current.on('click', (e) => {
            console.log('Click event fired, current tool:', activeToolRef.current);
            if (activeToolRef.current === 'polygon') {
              console.log('Adding polygon vertex at:', e.lngLat);
              const point: [number, number] = [e.lngLat.lng, e.lngLat.lat];
              tempVerticesRef.current.push(point);
              setPolygonVertices([...tempVerticesRef.current]);

              // Update temp line
              const source = mapInstance.current!.getSource('polygon-temp') as maplibregl.GeoJSONSource;
              if (source) {
                if (tempVerticesRef.current.length >= 2) {
                  const lineFeature: GeoJSON.Feature<GeoJSON.LineString> = {
                    type: 'Feature',
                    geometry: {
                      type: 'LineString',
                      coordinates: tempVerticesRef.current
                    },
                    properties: {}
                  };
                  source.setData(lineFeature);
                } else {
                  source.setData({ type: 'FeatureCollection', features: [] }); // Clear temp line if only one point
                }
              }

              // Save to history for undo
              polygonHistoryRef.current.push([...tempVerticesRef.current]);

              // Draw the polygon in progress (only if 3 or more vertices, otherwise it's just a line)
              if (tempVerticesRef.current.length >= 3) {
                const closedCoords = [...tempVerticesRef.current, tempVerticesRef.current[0]];
                const aoiSource = mapInstance.current!.getSource('aoi-results') as maplibregl.GeoJSONSource;
                if (aoiSource) {
                  aoiSource.setData({
                    type: 'Feature',
                    geometry: {
                      type: 'Polygon',
                      coordinates: [closedCoords]
                    },
                    properties: {}
                  });
                }
              }
            }
          });

          // Double-click to finish polygon
          mapInstance.current.on('dblclick', (e) => {
            if (activeToolRef.current === 'polygon' && tempVerticesRef.current.length >= 3) {
              e.preventDefault();

              const closedCoords = [...tempVerticesRef.current, tempVerticesRef.current[0]];
              const feature: GeoJSON.Feature = {
                type: 'Feature',
                geometry: {
                  type: 'Polygon',
                  coordinates: [closedCoords]
                },
                properties: {}
              };

              const source = mapInstance.current!.getSource('aoi-results') as maplibregl.GeoJSONSource;
              source.setData(feature);

              // Calculate area using turf
              if (isWizard && onAreaSelected) {
                const area = turf.area(feature) / 1_000_000; // Convert to km²
                setCurrentGeoJSON(feature);
                onAreaSelected(Math.round(area * 100) / 100, feature);
              }

              // Reset
              tempVerticesRef.current = [];
              polygonHistoryRef.current = []; // Clear undo history
              setPolygonVertices([]);
              mapInstance.current!.getCanvas().style.cursor = '';
            }
          });
        });

        mapInstance.current.on('error', (e) => {
          console.error("MapLibre internal error:", e);
          // If a fatal rendering error happens after init, we still switch
          if (e.error?.message?.includes('webgl') || e.error?.message?.includes('Location')) {
            setUseSimulation(true);
          }
        });

      } catch (err: any) {
        console.warn("Map initialization failed, switching to Simulation Mode:", err.message);
        setUseSimulation(true);
      }
    };

    initMap();

    return () => {
      if (mapInstance.current) {
        mapInstance.current.remove();
        mapInstance.current = null;
      }
    };
  }, [isWizard]);

  // Load initialGeoJSON when it changes (for processing screen, etc.)
  useEffect(() => {
    if (!isWizard && initialGeoJSON && mapInstance.current && isLoaded) {
      console.log('Loading initialGeoJSON:', initialGeoJSON);
      const source = mapInstance.current.getSource('aoi-results') as maplibregl.GeoJSONSource;
      if (source) {
        source.setData(initialGeoJSON);
        setCurrentGeoJSON(initialGeoJSON);

        // Fit map to AOI bounds
        try {
          const bbox = turf.bbox(initialGeoJSON);
          mapInstance.current.fitBounds(
            [bbox[0], bbox[1], bbox[2], bbox[3]],
            { padding: 50, duration: 1000 }
          );
          console.log('GeoJSON loaded and map fitted to bounds');
        } catch (e) {
          console.error('Error fitting bounds:', e);
        }
      } else {
        console.error('AOI source not found');
      }
    }
  }, [initialGeoJSON, isWizard, isLoaded]);

  const zoomIn = () => mapInstance.current?.zoomIn();
  const zoomOut = () => mapInstance.current?.zoomOut();
  const resetNorth = () => mapInstance.current?.resetNorthPitch();

  // Expose methods to parent via ref
  useImperativeHandle(ref, () => ({
    flyTo: (lat: number, lon: number, bounds?: [number, number, number, number]) => {
      if (!mapInstance.current) return;

      if (bounds) {
        mapInstance.current.fitBounds(
          [bounds[0], bounds[1], bounds[2], bounds[3]],
          { padding: 50, duration: 1000 }
        );
      } else {
        mapInstance.current.flyTo({
          center: [lon, lat],
          zoom: 12,
          duration: 1000
        });
      }

      if (onLocationChange) {
        onLocationChange(lat, lon);
      }
    },
    loadGeoJSON: (geojson: GeoJSON.Feature | GeoJSON.FeatureCollection) => {
      if (!mapInstance.current) return;

      const source = mapInstance.current.getSource('aoi-results') as maplibregl.GeoJSONSource;
      if (!source) return;

      // Handle both Feature and FeatureCollection
      let feature: GeoJSON.Feature;
      if (geojson.type === 'FeatureCollection') {
        // Use the first polygon/multipolygon feature
        const polyFeature = geojson.features.find(f =>
          f.geometry && ['Polygon', 'MultiPolygon'].includes(f.geometry.type)
        );
        if (!polyFeature) return;
        feature = polyFeature;
      } else {
        feature = geojson;
      }

      source.setData(feature);
      setCurrentGeoJSON(feature);

      // Calculate area
      const area = turf.area(feature) / 1_000_000; // km²
      if (onAreaSelected) {
        onAreaSelected(Math.round(area * 100) / 100, feature);
      }

      // Fit map to geometry bounds
      const bbox = turf.bbox(feature);
      mapInstance.current.fitBounds(
        [bbox[0], bbox[1], bbox[2], bbox[3]],
        { padding: 50, duration: 1000 }
      );
    },
    clearAOI: () => {
      if (!mapInstance.current) return;

      const source = mapInstance.current.getSource('aoi-results') as maplibregl.GeoJSONSource;
      if (source) {
        source.setData({
          type: 'FeatureCollection',
          features: []
        });
      }

      setCurrentGeoJSON(null);
      setPolygonVertices([]);
      if (onAreaSelected) {
        onAreaSelected(0);
      }
    }
  }));

  // If MapLibre initialization failed, show error state
  if (useSimulation) {
    return (
      <div className={`relative bg-slate-50 overflow-hidden ${className} flex items-center justify-center`}>
        <div className="max-w-md mx-auto text-center p-8 space-y-4">
          <div className="w-16 h-16 bg-rose-100 rounded-full flex items-center justify-center mx-auto">
            <AlertCircle className="w-8 h-8 text-rose-600" />
          </div>
          <div className="space-y-2">
            <h3 className="text-lg font-bold text-slate-900">Map Unavailable</h3>
            <p className="text-sm text-slate-600 leading-relaxed">
              Unable to initialize the interactive map. This may be due to WebGL not being supported or enabled in your browser.
            </p>
          </div>
          <div className="bg-slate-100 rounded-lg p-4 text-left space-y-2">
            <p className="text-xs font-bold text-slate-700">Troubleshooting:</p>
            <ul className="text-xs text-slate-600 space-y-1 list-disc list-inside">
              <li>Ensure WebGL is enabled in your browser settings</li>
              <li>Update your graphics drivers</li>
              <li>Try a different browser (Chrome, Firefox, or Edge)</li>
              <li>Disable hardware acceleration and re-enable it</li>
            </ul>
          </div>
          <button
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-indigo-600 text-white rounded-lg text-sm font-medium hover:bg-indigo-700 transition-colors"
          >
            Reload Page
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className={`relative bg-slate-50 overflow-hidden group ${className} flex items-center justify-center`}>
      {!isLoaded && (
        <div className="flex flex-col items-center gap-3 text-slate-400 z-20">
          <Loader2 className="w-8 h-8 animate-spin" />
          <span className="text-xs font-medium uppercase tracking-widest">Loading Map Engine...</span>
        </div>
      )}

      <div ref={mapContainer} className={`absolute inset-0 w-full h-full transition-opacity duration-700 ${isLoaded ? 'opacity-100' : 'opacity-0'}`} />

      {isLoaded && (
        <>
          <div className="absolute right-4 top-4 space-y-2 z-10">
            <div className="bg-white/95 backdrop-blur rounded-lg border border-slate-200 shadow-lg overflow-hidden flex flex-col">
              <button onClick={zoomIn} className="p-2 hover:bg-slate-100 border-b border-slate-100"><Plus className="w-4 h-4 text-slate-600" /></button>
              <button onClick={zoomOut} className="p-2 hover:bg-slate-100"><Minus className="w-4 h-4 text-slate-600" /></button>
            </div>
            <button onClick={resetNorth} className="p-2 bg-white/95 backdrop-blur rounded-lg border border-slate-200 shadow-lg hover:bg-slate-100 transition-colors">
              <Navigation className="w-4 h-4 text-slate-600" />
            </button>
            <button
              onClick={handleLocate}
              disabled={isLocating}
              className="p-2 bg-white/95 backdrop-blur rounded-lg border border-slate-200 shadow-lg hover:bg-slate-100 transition-colors disabled:opacity-50"
              title="Find My Location"
            >
              {isLocating ? (
                <Loader2 className="w-4 h-4 text-indigo-600 animate-spin" />
              ) : (
                <Crosshair className="w-4 h-4 text-slate-600" />
              )}
            </button>
          </div>

          <div className="absolute left-4 top-4 z-10">
            <div className="bg-white/95 backdrop-blur rounded-lg border border-slate-200 shadow-lg flex flex-col p-1">
              <button
                onClick={() => setActiveTool('hand')}
                className={`p-2 rounded-md transition-colors ${activeTool === 'hand' ? 'bg-indigo-50 text-indigo-600' : 'hover:bg-slate-100 text-slate-600'}`}
                title="Pan & Zoom"
              >
                <MousePointer2 className="w-4 h-4" />
              </button>
              {isWizard && (
                <>
                  <button
                    onClick={() => setActiveTool('box')}
                    className={`p-2 rounded-md transition-colors ${activeTool === 'box' ? 'bg-indigo-50 text-indigo-600' : 'hover:bg-slate-100 text-slate-600'}`}
                    title="Draw Rectangle"
                  >
                    <Box className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => setActiveTool('polygon')}
                    className={`p-2 rounded-md transition-colors ${activeTool === 'polygon' ? 'bg-indigo-50 text-indigo-600' : 'hover:bg-slate-100 text-slate-600'}`}
                    title="Draw Polygon"
                  >
                    <Pentagon className="w-4 h-4" />
                  </button>
                  {polygonVertices.length > 0 && activeTool === 'polygon' && (
                    <button
                      onClick={handleUndo}
                      className="p-2 rounded-md hover:bg-amber-50 text-amber-600 transition-colors"
                      title="Undo Last Point (Ctrl+Z)"
                    >
                      <Undo2 className="w-4 h-4" />
                    </button>
                  )}
                  {(currentGeoJSON || polygonVertices.length > 0) && (
                    <button
                      onClick={() => {
                        const source = mapInstance.current?.getSource('aoi-results') as maplibregl.GeoJSONSource;
                        if (source) {
                          source.setData({ type: 'FeatureCollection', features: [] });
                        }
                        setCurrentGeoJSON(null);
                        setPolygonVertices([]);
                        tempVerticesRef.current = []; // Clear temp vertices
                        polygonHistoryRef.current = []; // Clear undo history
                        setActiveTool('hand');
                        if (onAreaSelected) onAreaSelected(0);
                      }}
                      className="p-2 rounded-md hover:bg-rose-50 text-rose-600 transition-colors border-t border-slate-200"
                      title="Clear AOI"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </>
              )}
            </div>
          </div>

          <div className="absolute bottom-4 left-4 right-4 flex justify-between items-end pointer-events-none z-10">
            <div className="bg-slate-900/85 backdrop-blur text-white px-3 py-1.5 rounded-lg text-[10px] font-medium pointer-events-auto flex items-center gap-2">
              <MapIcon className="w-3 h-3 text-indigo-400" />
              MapLibre GL Engine | ESRI World Street Map
            </div>
            <div className="flex gap-2 pointer-events-auto">
              <button className="bg-white/95 backdrop-blur px-3 py-2 rounded-lg border border-slate-200 shadow-lg flex items-center gap-2 text-xs font-medium text-slate-700 hover:bg-slate-100">
                <Layers className="w-4 h-4" /> Layers
              </button>
              <button className="bg-white/95 backdrop-blur p-2 rounded-lg border border-slate-200 shadow-lg flex items-center justify-center hover:bg-slate-100">
                <Maximize2 className="w-4 h-4 text-slate-600" />
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
});

export default MapView;
