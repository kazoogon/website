export class Country {

  public countryInfos = [
    {
      'index': 0,
      'name': 'japan',
      'latlng': [35, 139],
      'desc': 'I was boooooooorn 👶'
    },
    {
      'index': 1,
      'name': 'spain',
      'latlng': [40.4167, -3.7037],
      'desc' : 'hitch hike and Spanish people made for me paella, Gracias &#129368'
    },
    {
      'index': 2,
      'name': 'uk',
      'latlng': [51.2838, 0],
      'desc' : "I bought bicycle and I've got cramp in my leg 🚲"
    },
    {
      'index': 3,
      'name': 'germany',
      'latlng': [52.52, 13.4049],
      'desc' : 'I had eaten almost everyday german cookie and beer &#129346'
    },
    {
      'index': 4,
      'name': 'poland',
      'latlng': [52.2296, 21.0122],
      'desc': 'My wallet and phone were stolen &#128549;'
    },
    {
      'index': 5,
      'name': 'ukraine',
      'latlng': [50.4501, 30.5234],
      'desc' : 'I had bird droppings on my head &#128557'
    },
    {
      'index': 6,
      'name': 'mexico',
      'latlng': [23.6345, -102.5527],
      'desc' : 'Cabron soy yo!!! &#129312'
    },
    {
      'index': 7,
      'name': 'guatemala',
      'latlng': [15.7834, -90.2307],
      'desc' : 'I bought remote from remote seller at first time in my life &#128241'
    },
    {
      'index': 8,
      'name': 'peru',
      'latlng': [-9.1899, -75.0151],
      'desc' : "When I walked near from Nazca Lines, I've got cramp in my leg 🏃"
    },
    {
      'index': 9,
      'name': 'bolivia',
      'latlng': [-16.2901, -63.5886],
      'desc' : "I was excited at Uyuni, and I've got cramp in my leg &#128557",
    },
    {
      'index': 10,
      'name': 'chile',
      'latlng': [-35.6751, -71.5429],
      'desc' : 'I was excited at delicious sea food, and I had a stomachache &#128526'
    },
    {
      'index': 11,
      'name': 'argentina',
      'latlng': [-38.416, -63.6166],
      'desc' : "My firend's mom suddenly woke me up to go to ice cream shop at night 2:00, and I've got cramp in my leg &#128096",
    },
    {
      'index': 12,
      'name': 'uruguay',
      'latlng': [-32.5227, -55.7658],
      'desc': 'I was refused entering country at passport control, because I wore T-shirt Real Madrid. So I took off it 🤣'
    },
  ];

  /**
   * @param {string} name
   * @returns {any}
   */
  public getCountryInfoByName = (name: string): any => {
    return this.countryInfos.find(country => country.name === name);
  }
}
