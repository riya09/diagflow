<template>
  <header>
    <div class="logo-title">
      <svg width="16" height="15" viewBox="0 0 16 15" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M9 1V11M9 1L3 7.66667M9 1L13 5.44444" stroke="#fff" stroke-linecap="round" stroke-linejoin="round"/>
        <circle cx="2" cy="9" r="1.5" stroke="#fff"/>
        <circle cx="9" cy="13" r="1.5" stroke="#fff"/>
        <circle cx="14" cy="7" r="1.5" stroke="#fff"/>
      </svg>
      <h1>DiagFlow</h1>
    </div>
    <a href="https://github.com/riya09/diagflow" target="_blank">
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 98 96"><path fill="#fff" fill-rule="evenodd" d="M48.854 0C21.839 0 0 22 0 49.217c0 21.756 13.993 40.172 33.405 46.69 2.427.49 3.316-1.059 3.316-2.362 0-1.141-.08-5.052-.08-9.127-13.59 2.934-16.42-5.867-16.42-5.867-2.184-5.704-5.42-7.17-5.42-7.17-4.448-3.015.324-3.015.324-3.015 4.934.326 7.523 5.052 7.523 5.052 4.367 7.496 11.404 5.378 14.235 4.074.404-3.178 1.699-5.378 3.074-6.6-10.839-1.141-22.243-5.378-22.243-24.283 0-5.378 1.94-9.778 5.014-13.2-.485-1.222-2.184-6.275.486-13.038 0 0 4.125-1.304 13.426 5.052a46.97 46.97 0 0 1 12.214-1.63c4.125 0 8.33.571 12.213 1.63 9.302-6.356 13.427-5.052 13.427-5.052 2.67 6.763.97 11.816.485 13.038 3.155 3.422 5.015 7.822 5.015 13.2 0 18.905-11.404 23.06-22.324 24.283 1.78 1.548 3.316 4.481 3.316 9.126 0 6.6-.08 11.897-.08 13.526 0 1.304.89 2.853 3.316 2.364 19.412-6.52 33.405-24.935 33.405-46.691C97.707 22 75.788 0 48.854 0z" clip-rule="evenodd"/></svg>
    </a>
  </header>
</template>

<style lang="scss" scoped>
  header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 1rem;
    background-color: #5273ce;
    color: white;
    .logo-title {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      svg {
        width: 2rem;
        height: 2rem;
      }
      h1 {
        margin: 0;
        font-size: 1.75rem;
        font-family: 'Cascadia Mono', serif;
        font-weight: 500;;
      }
    }
    a {
      color: white;
      text-decoration: none;
      font-size: 1.2rem;
    }
    svg {
      width: 1.5rem;
      height: 1.5rem;
    }
  }

</style>
