import { ImageResponse } from 'next/og';

export const alt = 'Ander Fernández Rúa, PhD researcher in computational neuroscience';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

// Preview card used when the site is shared on LinkedIn, X, WhatsApp...
export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div style={{ width: '100%', height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'center', padding: '0 90px', background: '#0c1220', color: '#e6eaf1' }}>
        <div style={{ width: 90, height: 4, background: '#e8a849', marginBottom: 40 }} />
        <div style={{ fontSize: 80, lineHeight: 1.05, letterSpacing: -1 }}>Ander Fernández Rúa</div>
        <div style={{ fontSize: 34, marginTop: 28, color: '#94a0b4', lineHeight: 1.35, maxWidth: 900 }}>
          PhD researcher in computational neuroscience. Models of brain networks, ageing and metabolism.
        </div>
        <div style={{ fontSize: 26, marginTop: 50, color: '#e8a849' }}>anderfernandez.me</div>
      </div>
    ),
    size,
  );
}
