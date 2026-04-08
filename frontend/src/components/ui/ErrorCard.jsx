// frontend/src/components/ui/ErrorCard.jsx
import { AlertCircle, RefreshCcw } from 'lucide-react';
import Card from './Card.jsx';

export default function ErrorCard({ message, onRetry }) {
  return (
    <Card style={{
      padding: '40px 24px', textAlign: 'center',
      border: '1px dashed var(--red)', background: 'var(--red-bg)',
      display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 16
    }}>
      <div style={{
        width: 48, height: 48, borderRadius: '50%',
        background: 'rgba(220,38,38,0.1)', display: 'flex',
        alignItems: 'center', justifyContent: 'center'
      }}>
        <AlertCircle size={24} color="var(--red)" />
      </div>
      <div>
        <h3 style={{ fontSize: 16, fontWeight: 700, color: 'var(--red)', marginBottom: 4 }}>
          Connection Error
        </h3>
        <p style={{ fontSize: 13, color: 'var(--text2)', maxWidth: 400 }}>
          {message || "We're having trouble connecting to the server. Please check your network or try again."}
        </p>
      </div>
      {onRetry && (
        <button
          onClick={onRetry}
          style={{
            display: 'flex', alignItems: 'center', gap: 8,
            padding: '10px 20px', borderRadius: 10,
            background: 'var(--accent)', color: '#fff',
            fontSize: 13, fontWeight: 600, border: 'none', cursor: 'pointer',
            boxShadow: 'var(--shadow-sm)'
          }}
        >
          <RefreshCcw size={14} /> Retry Connection
        </button>
      )}
    </Card>
  );
}
