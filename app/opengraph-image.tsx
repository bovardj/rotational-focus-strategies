import { ImageResponse } from 'next/og'

export const runtime = 'nodejs'
export const alt = 'Rotational Focus Strategies'
export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'

// Orbit mark paths from app/icon.svg — background rect omitted so the blue
// OG background shows through. Embedded as a data URI because Satori does
// not support inline SVG <mask> elements.
const ORBIT_SVG = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1024 1024" style="fill-rule:nonzero;clip-rule:evenodd;stroke-linecap:round;stroke-linejoin:round;"><defs><mask id="orbitMask"><rect width="1024" height="1024" fill="white"/><ellipse cx="480" cy="320" rx="90" ry="90" fill="black"/></mask></defs><g transform="translate(512,512) scale(0.70) translate(-512,-512)"><path mask="url(#orbitMask)" d="M863.925 101.215C854.734 101.043 845.508 101.893 836.441 103.33C819.638 105.993 803.189 110.677 787.155 116.305C765.854 123.783 745.182 133.017 725.025 143.155C701.382 155.046 678.432 168.264 655.998 182.293C595.687 220.008 539.181 263.492 485.173 309.698C484.348 310.396 484.237 311.648 484.936 312.473C485.634 313.298 486.885 313.383 487.71 312.684C541.092 268.038 596.818 226.046 656.156 189.587C677.756 176.316 699.824 163.799 722.488 152.431C743.089 142.097 764.231 132.681 785.992 125.053C802.148 119.389 818.721 114.664 835.648 111.971C847.694 110.055 860.015 109.123 872.17 110.465C887.057 112.109 901.869 117.602 911.547 129.519C914.049 132.6 916.155 135.995 917.836 139.587C925.991 157.015 924.875 177.924 921.668 196.432C918.577 214.273 913.079 231.634 906.552 248.493C898.066 270.413 887.728 291.611 876.478 312.235C846.908 366.446 811.154 417.198 772.963 465.644C715.829 538.12 652.001 605.36 583.905 667.599C527.438 719.208 467.718 767.528 404.148 810.146C380.234 826.179 355.747 841.378 330.575 855.363C307.597 868.129 284.034 879.927 259.725 889.956C240.755 897.782 221.238 904.586 201.189 909.062C187.258 912.173 172.889 914.218 158.588 913.661C140.488 912.956 122.077 907.586 110.967 892.334C99.7817 876.979 98.8893 856.67 100.713 838.45C102.369 821.908 106.668 805.654 111.945 789.93C119.064 768.714 128.193 748.213 138.319 728.275C164.023 677.664 195.97 630.291 230.153 585.067C283.094 515.027 342.573 450.103 405.602 389.058C406.986 387.721 407.018 385.501 405.681 384.116C404.344 382.732 402.124 382.7 400.739 384.037C337.244 445.155 277.367 510.201 223.916 580.337C203.434 607.213 183.896 634.834 165.829 663.397C152.181 684.976 139.346 707.092 127.88 729.914C117.445 750.685 108.051 772.091 101.004 794.264C95.927 810.237 91.9268 826.759 90.7768 843.524C89.4565 862.769 92.0713 883.521 104.202 899.205C117.621 916.557 139.015 922.701 160.148 923.148C175.438 923.471 190.707 921.121 205.549 917.598C224.814 913.027 243.554 906.396 261.812 898.782C285.778 888.789 308.968 876.987 331.58 864.242C357.859 849.43 383.384 833.279 408.297 816.277C474.375 771.184 536.478 720.238 595.242 666.013C659.199 606.996 719.588 543.824 774.549 476.32C798.464 446.947 821.314 416.698 842.519 385.306C858.446 361.727 873.493 337.513 887.022 312.473C898.045 292.073 908.13 271.101 916.383 249.418C922.974 232.101 928.499 214.25 931.473 195.93C934.622 176.526 935.129 155.35 926.954 137.05C925.022 132.726 922.598 128.606 919.686 124.868C908.321 110.277 891.072 103.537 873.095 101.744C870.044 101.44 866.989 101.273 863.925 101.215Z" fill="white" stroke="white" stroke-width="50" stroke-linecap="butt" stroke-linejoin="round"/><path d="M489.449 485.865C548.224 431.263 605.967 398.701 618.421 413.135C630.876 427.569 593.326 483.533 534.551 538.135C475.776 592.737 418.033 625.299 405.579 610.865C393.124 596.431 430.674 540.467 489.449 485.865Z" fill="white" stroke="white" stroke-width="40" stroke-linecap="butt" stroke-linejoin="round"/><path d="M413.46 376.32L391.796 413.134L370.252 449.94L355.386 433.271L340.383 416.736L376.914 396.591L413.46 376.32Z" fill="white" stroke="white" stroke-width="80" stroke-linecap="butt" stroke-linejoin="miter" stroke-miterlimit="10"/></g></svg>`

async function fetchLusitanaBold(): Promise<ArrayBuffer> {
  const css = await fetch(
    'https://fonts.googleapis.com/css2?family=Lusitana:wght@700',
    { headers: { 'User-Agent': 'Mozilla/5.0 (compatible; Googlebot/2.1; +http://www.google.com/bot.html)' } }
  ).then(r => r.text())
  const url = css.match(/url\((https:\/\/fonts\.gstatic\.com[^)]+)\)/)?.[1]
  if (!url) throw new Error('Could not parse Lusitana font URL from Google Fonts CSS')
  return fetch(url).then(r => r.arrayBuffer())
}

export default async function Image() {
  let lusitanaFont: ArrayBuffer | null = null
  try {
    lusitanaFont = await fetchLusitanaBold()
  } catch {
    // render without custom font rather than returning a 500
  }
  const orbitSrc = `data:image/svg+xml;base64,${Buffer.from(ORBIT_SVG).toString('base64')}`

  return new ImageResponse(
    (
      <div
        style={{
          background: '#1e3a8a',
          width: '100%',
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <img src={orbitSrc} width={240} height={240} alt="" style={{ marginRight: '40px' }} />
        <div style={{ display: 'flex', flexDirection: 'column', color: 'white' }}>
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              fontSize: 72,
              fontWeight: 700,
              fontFamily: 'Lusitana',
              lineHeight: 1.1,
            }}
          >
            <span>Rotational Focus</span>
            <span>Strategies</span>
          </div>
          <div style={{ fontSize: 26, color: '#bfdbfe', fontStyle: 'italic', marginTop: 20 }}>
            A research-backed focus app by John Bovard
          </div>
          <div style={{ fontSize: 22, color: '#93c5fd', marginTop: 8 }}>
            focusapp.dev
          </div>
        </div>
      </div>
    ),
    {
      ...size,
      fonts: lusitanaFont
        ? [{ name: 'Lusitana', data: lusitanaFont, style: 'normal', weight: 700 }]
        : [],
    }
  )
}
