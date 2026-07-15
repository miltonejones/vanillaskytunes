export function createNavigationBar() {
  return `
      <nav class="navbar navbar-expand-lg navbar-dark bg-dark fixed-top">
        <div class="container">
          <a
            class="navbar-brand fw-bold cursor-pointer"
            style="color: rgb(25, 118, 210)"
            data-view="home"
          >
            <i class="fa-solid fa-podcast" style="color: white"></i>
            STATE<b style="color: white">CAST</b>
          </a>

          <button
            class="navbar-toggler"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#navbarNav"
            aria-controls="navbarNav"
            aria-expanded="false"
            aria-label="Toggle navigation"
          >
            <span class="navbar-toggler-icon"></span>
          </button>

          <div class="collapse navbar-collapse" id="navbarNav">
            <ul class="navbar-nav me-auto">
              <li class="nav-item">
                <a
                  class="nav-link cursor-pointer"
                  data-bs-toggle="collapse"
                  data-bs-target="#navbarNav"
                  data-view="home"
                >
                  <i class="fa-solid fa-house"></i> Home
                </a>
              </li>
              <li class="nav-item">
                <a
                  class="nav-link cursor-pointer"
                  data-bs-toggle="collapse"
                  data-bs-target="#navbarNav"
                  data-view="categories"
                >
                  <i class="fa-solid fa-book"></i> Categories
                </a>
              </li>
              <li class="nav-item">
                <a
                  class="nav-link cursor-pointer"
                  data-bs-toggle="collapse"
                  data-bs-target="#navbarNav"
                  data-view="subscriptions"
                >
                  <i class="fa-solid fa-bookmark"></i> Subscriptions
                  <span
                    id="subscription-count"
                    class="badge bg-light text-primary"
                    >(0)</span
                  >
                </a>
              </li>
            </ul>

            <form class="d-flex">
              <input
                class="form-control me-2"
                type="search"
                placeholder="Search podcasts..."
                aria-label="Search"
                value=""
              />
            </form>
          </div>
        </div>
      </nav>
   `;
}
