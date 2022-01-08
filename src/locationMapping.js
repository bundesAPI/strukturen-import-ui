class LocationMapping {
  constructor(config) {
    this.config = config;
  }
  addLocation(entity) {
    console.log(this.config);
    if (this.config.locationMapping === "defaultAddressMapping") {
      console.log(this.config.location.val);
      return [{ location: this.config.location.val }];
    } else if (this.config.locationMapping === "colorBasedMapping") {
      console.log(entity);
    }
    return null;
  }
}

export default LocationMapping;
