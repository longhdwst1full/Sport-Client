const { existsSync } = require('node:fs');
const { mkdir, readdir, readFile, writeFile } = require('node:fs/promises');
const { resolve } = require('node:path');

// Storefront chỉ đồng bộ những domain mình thực sự dùng. `system` cấp tham số công khai
// (bán kính giao miễn phí, biểu phí…) để UI không hardcode giá trị Admin có thể đổi.
// `assistant` (chat trợ lý mua sắm) và `support` (phiếu hỗ trợ của khách) thuộc Assistant V1.0.
const domains = ['auth', 'catalog', 'content', 'reviews', 'cart', 'customer', 'shipping', 'checkout', 'orders', 'payments', 'promotions', 'returns', 'system', 'assistant', 'support'];
const defaultBaseUrl =
  'https://raw.githubusercontent.com/longhdwst1full/dctd-utc/main/document/api/storefront';
const baseUrl = (process.env.SPORT_API_CONTRACT_BASE_URL || defaultBaseUrl).replace(/\/$/, '');
const siblingContractDirectory = resolve(__dirname, '../../api/document/api/storefront');
// CONTRACTS_SOURCE_DIR: override cho phép trỏ tới một checkout/worktree api/ bất kỳ
// (vd. một worktree đang review contract chưa merge vào api main). SPORT_API_CONTRACT_DIR
// giữ lại để tương thích ngược.
const contractDirectoryOverride = process.env.CONTRACTS_SOURCE_DIR || process.env.SPORT_API_CONTRACT_DIR;
const contractDirectory = contractDirectoryOverride
  ? resolve(contractDirectoryOverride)
  : (existsSync(siblingContractDirectory) ? siblingContractDirectory : undefined);
const outputDirectory = resolve(__dirname, '../contracts/storefront');

async function findSharedFiles() {
  // File dùng chung (vd. `_components.yaml`) mà các slice domain tham chiếu qua
  // `$ref: ./_components.yaml#/components/...`. Chỉ tồn tại khi sync từ thư mục cục bộ.
  if (!contractDirectory) return [];
  const entries = await readdir(contractDirectory).catch(() => []);
  return entries.filter((name) => name.startsWith('_') && name.endsWith('.yaml'));
}

async function main() {
  const contracts = await Promise.all(
    domains.map(async (domain) => {
      const content = contractDirectory
        ? await readFile(resolve(contractDirectory, `${domain}.yaml`), 'utf8')
        : await fetch(`${baseUrl}/${domain}.yaml`).then(async (response) => {
            if (!response.ok) throw new Error(`Cannot download ${domain}.yaml: HTTP ${response.status}`);
            return response.text();
          });
      if (!/^openapi:\s*3\./m.test(content)) {
        throw new Error(`${domain}.yaml is not an OpenAPI 3 contract`);
      }
      return { domain, content };
    }),
  );

  const sharedFileNames = await findSharedFiles();
  const sharedFiles = await Promise.all(
    sharedFileNames.map(async (name) => ({
      name,
      content: await readFile(resolve(contractDirectory, name), 'utf8'),
    })),
  );

  await mkdir(outputDirectory, { recursive: true });
  await Promise.all([
    ...contracts.map(({ domain, content }) =>
      writeFile(resolve(outputDirectory, `${domain}.yaml`), content, 'utf8'),
    ),
    ...sharedFiles.map(({ name, content }) => writeFile(resolve(outputDirectory, name), content, 'utf8')),
  ]);
  console.log(
    `Synced ${contracts.length} Storefront API contracts${sharedFiles.length ? ` + ${sharedFiles.length} shared file(s)` : ''} from ${contractDirectory ?? baseUrl}`,
  );
}

main().catch((error) => {
  console.error(error instanceof Error ? error.message : error);
  process.exitCode = 1;
});
