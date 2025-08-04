import { Routes, Route } from "react-router";
import { ViewportProvider } from "./providers/viewport-provider";
import { StoreProvider } from "./providers/store-provider";
import { Home } from "@/pages/home";
import { Admin } from "@/pages/admin";
import { Login } from "@/pages/login";
import { ProtectedRoute } from "@/components/protected-route";
// import { Helmet } from "react-helmet";

export const App = () => {
  return (
    <ViewportProvider>
      <StoreProvider>
        {/* <Helmet htmlAttributes={{ lang: "en" }}>
          <meta charSet="utf-8" />
          <meta name="viewport" content="width=device-width, initial-scale=1" />

          <title>Stepan Lipatov | Graphic Designer</title>
          <meta name="author" content="Stepan Lipatov" />
          <meta name="robots" content="index, follow" />
          <link rel="canonical" href="https://stepanplusdrawingultra.site/" />

          <meta
            name="description"
            content="On this web page, you could see almost 200 drawings I did in the last two years. That's how I draw when I don't have an assignment."
          />
          <meta
            name="keywords"
            content="graphic design, illustration, drawings, art portfolio, Stepan Lipatov, 3d image gallery"
          />

          <meta property="og:type" content="website" />
          <meta
            property="og:title"
            content="Stepan Lipatov | Graphic Designer"
          />
          <meta
            property="og:description"
            content="On this web page, you could see almost 200 drawings I did in the last two years. That's how I draw when I don't have an assignment."
          />
          <meta
            property="og:image"
            content="https://stepanplusdrawingultra.site/preview.jpeg"
          />
          <meta
            property="og:url"
            content="https://stepanplusdrawingultra.site/"
          />

          <meta name="twitter:card" content="summary_large_image" />
          <meta
            name="twitter:title"
            content="Stepan Lipatov | Graphic Designer"
          />
          <meta
            name="twitter:description"
            content="On this web page, you could see almost 200 drawings I did in the last two years. That's how I draw when I don't have an assignment."
          />
          <meta
            name="twitter:image"
            content="https://stepanplusdrawingultra.site/preview.jpeg"
          />
        </Helmet> */}
        <Routes>
          <Route index element={<Home />} />
          <Route element={<ProtectedRoute />}>
            <Route path="admin" element={<Admin />} />
          </Route>
          <Route path="login" element={<Login />} />
        </Routes>
      </StoreProvider>
    </ViewportProvider>
  );
};
