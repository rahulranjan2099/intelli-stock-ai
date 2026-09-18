export function ChatIcon({ name, size = 20 }: { name: 'spark' | 'plus' | 'chat' | 'arrow' | 'menu' | 'close' | 'chart'; size?: number }) {
  const paths = {
    spark: 'm12 3 2.6 6.4L21 12l-6.4 2.6L12 21l-2.6-6.4L3 12l6.4-2.6L12 3Z',
    plus: 'M12 5v14M5 12h14',
    chat: 'M21 11.5a8.5 8.5 0 0 1-8.5 8.5H4l-1 1v-9.5a8.5 8.5 0 0 1 17 0ZM7 10h9M7 14h6',
    arrow: 'M12 19V5m-6 6 6-6 6 6',
    menu: 'M4 6h16M4 12h16M4 18h16',
    close: 'm6 6 12 12M6 18 18 6',
    chart: 'M4 3v17h17M8 15l4-5 4 2 5-7',
  }
  return <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d={paths[name]} /></svg>
}
