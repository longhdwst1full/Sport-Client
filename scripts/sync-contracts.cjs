const { existsSync } = require('node:fs');
const { mkdir, readdir, readFile, writeFile } = require('node:fs/promises');
const { resolve } = require('node:path');

// Storefront chỉ đồng bộ những domain mình thực sự dùng. `system` cấp tham số công khai
// (bán kính giao miễn phí, biểu phí…) để UI không hardcode giá trị Admin có thể đổi.
// `assistant` (chat trợ lý mua sắm) và `support` (phiếu hỗ trợ của khách) thuộc Assistant V1.0.
const domains = ['auth', 'catalog', 'content', 'reviews', 'cart', 'customer', 'shipping', 'checkout', 'orders', 'payments', 'promotions', 'returns', 'system', 'assistant', 'support'];
const defaultBaseUrl =
  'https://raw.githubusercontent.com/longhdwst1full/Sport-api-doc/main/document/api/storefront';
const baseUrl = (process.env.SPORT_API_CONTRACT_BASE_URL || defaultBaseUrl).replace(/\/$/, '');
// Thư mục API nằm cạnh repo này: tên thật là `sport-api-doc`; `api` giữ lại cho checkout cũ.
const siblingContractDirectory = ['sport-api-doc', 'api']
  .map((repo) => resolve(__dirname, `../../${repo}/document/api/storefront`))
  .find((candidate) => existsSync(candidate));
// CONTRACTS_SOURCE_DIR: override cho phép trỏ tới một checkout/worktree api/ bất kỳ
// (vd. một worktree đang review contract chưa merge vào api main). SPORT_API_CONTRACT_DIR
// giữ lại để tương thích ngược.
const contractDirectoryOverride = process.env.CONTRACTS_SOURCE_DIR || process.env.SPORT_API_CONTRACT_DIR;
const contractDirectory = contractDirectoryOverride
  ? resolve(contractDirectoryOverride)
  : siblingContractDirectory;
const outputDirectory = resolve(__dirname, '../contracts/storefront');

// Repo API là private: tải từ GitHub raw cần token (CONTRACTS_GITHUB_TOKEN, scope `repo` hoặc fine-grained
// Contents:read). Không có token thì dùng CONTRACTS_SOURCE_DIR hoặc checkout `sport-api-doc` cạnh repo này.
const githubToken = process.env.CONTRACTS_GITHUB_TOKEN;
// File dùng chung mà các slice tham chiếu bằng `$ref: ./_components.yaml#/...`; phải nằm cạnh slice.
const remoteSharedFiles = ['_components.yaml'];

async function download(name) {
  const response = await fetch(`${baseUrl}/${name}`, githubToken ? { headers: { Authorization: `token ${githubToken}` } } : undefined);
  if (!response.ok) {
    const hint = response.status === 404 && !githubToken
      ? ' — repo API là private: đặt CONTRACTS_GITHUB_TOKEN hoặc CONTRACTS_SOURCE_DIR (thư mục document/api/...)'
      : '';
    throw new Error(`Cannot download ${name}: HTTP ${response.status}${hint}`);
  }
  return response.text();
}

async function main() {
  const contracts = await Promise.all(
    domains.map(async (domain) => {
      const content = contractDirectory
        ? await readFile(resolve(contractDirectory, `${domain}.yaml`), 'utf8')
        : await download(`${domain}.yaml`);
      if (!/^openapi:\s*3\./m.test(content)) {
        throw new Error(`${domain}.yaml is not an OpenAPI 3 contract`);
      }
      return { domain, content };
    }),
  );

  // `_*.yaml` dùng chung: từ thư mục cục bộ lấy mọi file bắt đầu bằng `_`, từ GitHub lấy danh sách đã biết.
  const sharedFiles = contractDirectory
    ? await Promise.all(
        (await readdir(contractDirectory))
          .filter((name) => name.startsWith('_') && name.endsWith('.yaml'))
          .map(async (name) => ({ name, content: await readFile(resolve(contractDirectory, name), 'utf8') })),
      )
    : await Promise.all(remoteSharedFiles.map(async (name) => ({ name, content: await download(name) })));

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
