"use client";

import { ServerApi } from "@/app/types/nezha-api";
import ServerCard from "@/components/ServerCard";
import { nezhaFetcher } from "@/lib/utils";
import useSWR from "swr";

export default function ServerListClient() {
  const { data } = useSWR<ServerApi>("/api/server", nezhaFetcher, {
    refreshInterval: Number(process.env.NEXT_PUBLIC_NezhaFetchInterval) || 2000,
  });

  if (!data) return null;

  const sortedServers = data.result.sort((a, b) => {
    if (a.display_index && b.display_index) {
      return b.display_index - a.display_index;
    }
    if (a.display_index) return -1;
    if (b.display_index) return 1;
    return a.id - b.id;
  });

  const groupedServers = sortedServers.reduce(
    (acc, server) => {
      const tag = server.tag || "default"; // 如果没有 tag，使用 "未分组"
      if (!acc[tag]) {
        acc[tag] = [];
      }
      acc[tag].push(server);
      return acc;
    },
    {} as Record<string, typeof sortedServers>,
  );

  return (
    <section className="grid grid-cols-1 gap-2 md:grid-cols-2">
      {Object.entries(groupedServers).map(([tag, servers]) => (
        <div key={tag}>
          <h2 className="text-lg font-bold">{tag}</h2>
          <div className="mt-2">
            {servers.map((serverInfo) => (
              <div className="mb-2">
                <ServerCard key={serverInfo.id} serverInfo={serverInfo} />
              </div>
            ))}
          </div>
        </div>
      ))}
    </section>
  );
}
