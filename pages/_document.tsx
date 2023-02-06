import Document, { Head, Html, Main, NextScript } from "next/document";

class MyDocument extends Document {
  render() {
    return (
      <Html lang="en">
        <Head>
          <link rel="icon" href="/favicon.ico" />
          <meta
            name="description"
            content="Generate your next journal entry bio in seconds."
          />
          <meta
            property="og:description"
            content="Generate your next journal entry in seconds."
          />
          <meta
            property="og:image"
            content="/og-image.png"
          />
          <meta
            name="twitter:image"
            content="/og-image.png"
          />
          <script src="https://maps.googleapis.com/maps/api/js?v=3.exp&sensor=false"></script>

        </Head>
        <body>
          <Main />
          <NextScript />
        </body>
      </Html>
    );
  }
}

export default MyDocument;
