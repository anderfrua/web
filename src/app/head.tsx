export default function Head() {
  return (
    <>
      <title>Ander Fernandez</title>
      <meta name="description" content="Personal portfolio of Ander Fernandez – physicist, electronics engineer and data science enthusiast." />
      <link rel="icon" href="/favicon.svg" />
      <script
        dangerouslySetInnerHTML={{
          __html: `
            (function() {
              const theme = localStorage.getItem('theme');
              if (theme === 'dark' || (!theme && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
                document.documentElement.classList.add('dark');
              } else {
                document.documentElement.classList.remove('dark');
              }
            })();
          `,
        }}
      />  
    </>
  );
}
