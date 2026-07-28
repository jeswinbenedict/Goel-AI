import { useRealtime } from '../realtime/RealtimeProvider'
import { Radio, RefreshCw } from 'lucide-react'
import { C } from '../styles/theme'

export default function ConnectionStatus() {
  const { connected, connecting, refetchState } = useRealtime()

  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: '6px',
        padding: '5px 12px',
        borderRadius: '100px',
        background: connected
          ? `${C.green}12`
          : connecting
          ? `${C.yellow}12`
          : `${C.red}12`,
        border: `1px solid ${
          connected ? C.green : connecting ? C.yellow : C.red
        }30`,
        fontSize: '11px',
        fontWeight: 700,
        color: connected ? C.green : connecting ? C.yellow : C.red,
        transition: 'all 0.3s ease',
      }}
      title={connected ? 'WebSocket connected' : 'WebSocket disconnected - using fallback'}
    >
      <Radio
        size={11}
        strokeWidth={2.5}
        style={{
          animation: connected ? 'glowPulse 2s infinite' : 'none',
        }}
      />
      <span>
        {connected ? 'LIVE WS' : connecting ? 'CONNECTING...' : 'DISCONNECTED'}
      </span>
      {!connected && (
        <button
          onClick={refetchState}
          style={{
            background: 'none',
            border: 'none',
            color: 'inherit',
            cursor: 'pointer',
            padding: 0,
            display: 'flex',
            alignItems: 'center',
          }}
          title="Retry REST snapshot"
        >
          <RefreshCw size={10} strokeWidth={2.5} />
        </button>
      )}
    </div>
  )
}
