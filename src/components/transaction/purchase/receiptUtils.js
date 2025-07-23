// src/components/transaction/utils/receiptUtils.js
export const nextFrame = () =>
  new Promise((r) => requestAnimationFrame(() => requestAnimationFrame(r)));

export const waitForImages = async (node) => {
  const imgs = Array.from(node.querySelectorAll("img"));
  await Promise.all(
    imgs.map((img) =>
      img.complete
        ? Promise.resolve()
        : new Promise((res) => {
            img.onload = img.onerror = res;
          })
    )
  );
};

export const buildFingerprint = (id) =>
  btoa(`${id || "tmp"}-${Date.now()}-${Math.random()}`).slice(0, 22);
