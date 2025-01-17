/* eslint-disable operator-linebreak */
export default function decorate(win = window) {
// console.log(win.document.location.pathname)
  const blackHeaderPages = ['/jobs/', '/stories/process/whiteboard-101', '/stories/process/designing-for-creative-systems'];
  const useBlackHeader = blackHeaderPages.some((i) => win.document.location.pathname.includes(i)) || win.document.location.pathname.includes('/jobs/');
  const headerImage = useBlackHeader ? '/resources/adobe-black-tag-new.svg' : '/resources/adobe-white-tag-new.svg';
  const headerImageMobile = useBlackHeader ? '/resources/adobe-design.png' : './media_1d3601e007f7c9b5cb83303a390ca0e7fec040eef.png';
  const hamburgerMenu = useBlackHeader ? '/resources/black-hamburger.png' : '/resources/white-hamburger.png';
  const closeIcon = useBlackHeader ? '/resources/close-icon.png' : '/resources/close-icon-white.png';
  const colorClass = useBlackHeader ? 'black' : '';
  const doc = win.document;
  const $header = doc.querySelector('body > header');
  let windowWidth = window.innerWidth;
  $header.id = 'global-header';
  const delay = 250;
  let timeout = false;
  let calls = 0;
  let beforeIsMobile = windowWidth >= 1000;
  let afterIsMobile = windowWidth >= 1000;
  let showMenuDropdown = true;
  function setupHeader() {
    if ($header) {
      windowWidth = window.innerWidth;
      afterIsMobile = windowWidth >= 1000;
      if (calls === 0 || beforeIsMobile !== afterIsMobile) {
        if (windowWidth >= 1000) {
          $header.innerHTML =
                        ` \
                            <div>                \
                                <div class="logo">  \
                                    <a href="/">      \
                                        <img>       \
                                            <source media="(max-width: 400px)" srcset="${headerImage}?width=750&format=webply&optimize=medium"> \
                                            <img src="${headerImage}?width=2000&format=webply&optimize=medium" alt="" loading="eager"> \
                                        </img>      \
                                    </a>              \
                                </div>              \
                            </div>                \
                                            \
                            <nav class="${colorClass}"> \
                                <a href="/team/">Team</a> \
                                <a href="/stories/">Stories</a> \
                                <a href="/toolkit/">Toolkit</a> \
                                <a href="/jobs/">Jobs</a> \
                            </nav> \
                        `;
        } else {
          // eslint-disable-next-line operator-linebreak
          $header.innerHTML =
                        ` \
                            <div>                \
                                <div class="logo">  \
                                    <a href="/">      \
                                        <picture>       \
                                        <source media="(max-width: 400px)" srcset="${headerImageMobile}?width=750&format=webply&optimize=medium"> \
                                        <img src="${headerImageMobile}?width=2000&format=webply&optimize=medium" alt="" loading="eager"> \
                                        </picture>      \
                                    </a>              \
                                </div>              \
                            </div>                \
                            <div class="tagline ${colorClass}"> \
                            </div>                \
                            <nav class="${colorClass}"> \
                                <button class="dropdown-menu-button">
                                    <img id="menu-toggle" src="${hamburgerMenu}" height=25> \
                                </button>
                            </nav> \
                            <div class="menu-dropdown-container exit-menu hide-menu"> \
                                <a href="/team/">Team</a> \
                                <a href="/stories/">Stories</a> \
                                <a href="/toolkit/">Toolkit</a> \
                                <a href="/jobs/">Jobs</a> \
                            </div> \
                        `;
          $header.querySelector('.dropdown-menu-button').addEventListener('click', () => {
            showMenuDropdown = !showMenuDropdown;
            if (showMenuDropdown) {
              $header.querySelector('.menu-dropdown-container').classList.add('exit-menu');
              $header.querySelector('#menu-toggle').src = hamburgerMenu;
              $header.querySelector('#menu-toggle').classList.remove('close-menu');
              setTimeout(() => {
                if (showMenuDropdown) {
                  $header.querySelector('.menu-dropdown-container').classList.add('hide-menu');
                }
              }, 400);
            } else {
              $header.querySelector('#menu-toggle').src = closeIcon;
              $header.querySelector('#menu-toggle').classList.add('close-menu');
              $header.querySelector('.menu-dropdown-container').classList.remove('hide-menu');
              setTimeout(() => {
                $header.querySelector('.menu-dropdown-container').classList.remove('exit-menu');
              }, 0);
            }
          });
        }
        beforeIsMobile = windowWidth >= 1000;
      }
    }
    calls += 1;
  }
  window.addEventListener('resize', () => {
    clearTimeout(timeout);
    timeout = setTimeout(setupHeader, delay);
  });
  setupHeader();
}
