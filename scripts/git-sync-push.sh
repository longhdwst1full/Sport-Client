#!/usr/bin/env bash
# Pull trước rồi mới push: tránh đè/bị từ chối khi người khác đã push lên cùng nhánh.
#   yarn push:safe            # rebase lên origin/<nhánh hiện tại>, chạy lint + test, rồi push
#   SKIP_CHECKS=1 yarn push:safe   # bỏ lint/test (chỉ khi đã chạy tay)
# Có conflict: script dừng, KHÔNG tự chọn bên nào. Sửa file conflict → `git add <file>` →
# `git rebase --continue` → chạy lại `yarn push:safe`. Muốn huỷ: `git rebase --abort`.
set -euo pipefail

branch="$(git rev-parse --abbrev-ref HEAD)"
if [ "$branch" = "HEAD" ]; then
  echo "✖ Đang ở detached HEAD; checkout một nhánh trước." >&2
  exit 1
fi
if [ -d "$(git rev-parse --git-path rebase-merge)" ] || [ -d "$(git rev-parse --git-path rebase-apply)" ]; then
  echo "✖ Đang dở một rebase. Xử lý xong (git rebase --continue | --abort) rồi chạy lại." >&2
  exit 1
fi

echo "→ git fetch origin"
git fetch origin

if git rev-parse --verify --quiet "origin/$branch" >/dev/null; then
  echo "→ git pull --rebase --autostash origin $branch"
  if ! git pull --rebase --autostash origin "$branch"; then
    echo
    echo "✖ Conflict khi rebase lên origin/$branch. File cần sửa:" >&2
    git diff --name-only --diff-filter=U >&2 || true
    echo "Sửa xong: git add <file> && git rebase --continue, rồi chạy lại yarn push:safe." >&2
    exit 1
  fi
fi

if [ "${SKIP_CHECKS:-0}" != "1" ]; then
  echo "→ yarn lint && yarn test"
  yarn lint
  yarn test
fi

echo "→ git push origin $branch"
git push origin "$branch"
echo "✔ Đã push $branch"
