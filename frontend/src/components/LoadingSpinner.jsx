export default function LoadingSpinner({ small = false, fullPage = false }) {
  const spinnerElement = <div className={`spinner ${small ? 'spinner-sm' : ''}`}></div>;

  if (fullPage) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', width: '100vw', background: 'var(--dark)' }}>
        {spinnerElement}
      </div>
    );
  }

  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', padding: '2rem' }}>
      {spinnerElement}
    </div>
  );
}
