import { createContext, useContext, useEffect, useState, useCallback } from 'react'
import { socket } from './socket'
import { api } from '../api/client'

const RealtimeContext = createContext(null)

export function RealtimeProvider({ children }) {
  const [connected, setConnected] = useState(socket.connected)
  const [connecting, setConnecting] = useState(!socket.connected)
  
  // Real-time states
  const [survivors, setSurvivors] = useState([])
  const [teams, setTeams] = useState([])
  const [earthquakes, setEarthquakes] = useState([])
  const [timeline, setTimeline] = useState([])
  const [stats, setStats] = useState(null)
  const [routes, setRoutes] = useState(null)
  const [seismicBuffer, setSeismicBuffer] = useState([])
  const [quakeTime, setQuakeTime] = useState(null)
  const [epicenter, setEpicenter] = useState(null)

  // Fetch initial REST fallback snapshot
  const hydrateSnapshot = useCallback(async () => {
    try {
      const data = await api.getState()
      if (data) {
        if (data.survivors) setSurvivors(data.survivors)
        if (data.teams) setTeams(data.teams)
        if (data.earthquakes) setEarthquakes(data.earthquakes)
        if (data.timeline) setTimeline(data.timeline)
        if (data.stats) setStats(data.stats)
        if (data.quake_time) setQuakeTime(data.quake_time)
        if (data.epicenter) setEpicenter(data.epicenter)
      }
    } catch (e) {
      console.warn('[RealtimeProvider] REST snapshot hydration failed:', e)
    }
  }, [])

  useEffect(() => {
    // Initial fetch in case WS connection takes time or fails
    hydrateSnapshot()

    function onConnect() {
      setConnected(true)
      setConnecting(false)
    }

    function onDisconnect() {
      setConnected(false)
      setConnecting(false)
    }

    function onConnectError() {
      setConnected(false)
      setConnecting(false)
    }

    function onSnapshot(data) {
      if (data.survivors) setSurvivors(data.survivors)
      if (data.teams) setTeams(data.teams)
      if (data.earthquakes) setEarthquakes(data.earthquakes)
      if (data.timeline) setTimeline(data.timeline)
      if (data.stats) setStats(data.stats)
      if (data.quake_time) setQuakeTime(data.quake_time)
      if (data.epicenter) setEpicenter(data.epicenter)
    }

    function onEpicenterUpdated(epInfo) {
      setEpicenter(epInfo)
    }

    function onSurvivorDetected(survivor) {
      setSurvivors(prev => {
        const exists = prev.some(s => s.id === survivor.id)
        return exists ? prev.map(s => s.id === survivor.id ? survivor : s) : [survivor, ...prev]
      })
    }

    function onSurvivorRescued({ id }) {
      setSurvivors(prev => prev.map(s => s.id === id ? { ...s, status: 'rescued' } : s))
    }

    function onTeamsMoved(updatedTeams) {
      setTeams(updatedTeams)
    }

    function onEarthquakeNew(quake) {
      setEarthquakes(prev => [quake, ...prev.slice(0, 19)])
    }

    function onEarthquakeList(list) {
      setEarthquakes(list)
    }

    function onTimelineEvent(evt) {
      setTimeline(prev => [evt, ...prev])
    }

    function onStatsUpdate(newStats) {
      setStats(newStats)
    }

    function onRoutesUpdated(routeData) {
      setRoutes(routeData)
      if (routeData.teams) setTeams(routeData.teams)
    }

    function onSeismicData(pt) {
      setSeismicBuffer(prev => {
        const next = [...prev, pt]
        return next.length > 60 ? next.slice(next.length - 60) : next
      })
    }

    socket.on('connect', onConnect)
    socket.on('disconnect', onDisconnect)
    socket.on('connect_error', onConnectError)
    socket.on('state:snapshot', onSnapshot)
    socket.on('epicenter:updated', onEpicenterUpdated)
    socket.on('survivor:detected', onSurvivorDetected)
    socket.on('survivor:rescued', onSurvivorRescued)
    socket.on('teams:moved', onTeamsMoved)
    socket.on('earthquake:new', onEarthquakeNew)
    socket.on('earthquake:list', onEarthquakeList)
    socket.on('timeline:event', onTimelineEvent)
    socket.on('stats:update', onStatsUpdate)
    socket.on('routes:updated', onRoutesUpdated)
    socket.on('seismic:data', onSeismicData)

    return () => {
      socket.off('connect', onConnect)
      socket.off('disconnect', onDisconnect)
      socket.off('connect_error', onConnectError)
      socket.off('state:snapshot', onSnapshot)
      socket.off('epicenter:updated', onEpicenterUpdated)
      socket.off('survivor:detected', onSurvivorDetected)
      socket.off('survivor:rescued', onSurvivorRescued)
      socket.off('teams:moved', onTeamsMoved)
      socket.off('earthquake:new', onEarthquakeNew)
      socket.off('earthquake:list', onEarthquakeList)
      socket.off('timeline:event', onTimelineEvent)
      socket.off('stats:update', onStatsUpdate)
      socket.off('routes:updated', onRoutesUpdated)
      socket.off('seismic:data', onSeismicData)
    }
  }, [hydrateSnapshot])

  const requestPSO = useCallback(() => {
    socket.emit('request:pso')
  }, [])

  const selectEpicenter = useCallback((quake) => {
    if (socket && socket.connected) {
      socket.emit('select:epicenter', quake)
    }
  }, [])

  const value = {
    connected,
    connecting,
    survivors,
    teams,
    earthquakes,
    timeline,
    stats,
    routes,
    seismicBuffer,
    quakeTime,
    epicenter,
    requestPSO,
    selectEpicenter,
    refetchState: hydrateSnapshot,
  }

  return <RealtimeContext.Provider value={value}>{children}</RealtimeContext.Provider>
}

export function useRealtime() {
  const context = useContext(RealtimeContext)
  if (!context) {
    throw new Error('useRealtime must be used within a RealtimeProvider')
  }
  return context
}
