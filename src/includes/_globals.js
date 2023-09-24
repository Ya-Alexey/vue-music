export default {
  install(app) {
    // console.log(import.meta);
    const baseComponents = import.meta.glob("../components/global/*.vue", {
      eager: true,
    });

    // console.log(baseComponents);

    Object.entries(baseComponents).forEach(([path, module]) => {
      const componentsName = path.split('/').pop().replace(/\.\w+$/, "");
      // console.log('componentsName: ', componentsName);
      // console.log('module: ', module);

      app.component(componentsName, module.default)
    })
  }
}