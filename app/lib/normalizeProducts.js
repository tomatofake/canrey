export const normalizeProducts = (products) => {
  return products.map((product) => {
    const normalized = { ...product };

    if (product.size) {
      const clean = product.size.replace(/\s+/g, '');
      const parts = clean.split(/[xх]/i);
      if (parts.length >= 2) {
        const width = parts[1];
        const depth = parts[2] || parts[1];
        normalized.size = `${width}×${depth}`;
      }
    }

    if (product.ovenType) {
      normalized.ovenType = product.ovenType;
    } else if (product.type) {
      normalized.ovenType = product.type;
    }

    if (product.surfaceConfiguration) {
      const text = product.surfaceConfiguration.toLowerCase();

      const gas = (text.match(/(\d+)\s*(газ|газові)/i) || [])[1];
      const electric = (text.match(/(\d+)\s*(електр|електричні)/i) || [])[1];

      const parts = [];
      if (gas) parts.push(`${gas} газові`);
      if (electric) parts.push(`${electric} електричні`);

      if (parts.length) {
        normalized.surfaceConfiguration = parts.join(" + ");
      } else {
        normalized.surfaceConfiguration = product.surfaceConfiguration;
      }
    }
    return normalized;
  });
};
