var Car = function(wheels) {
  var numWheels = wheels;
  var fuelLevel = 50;
  var year = 1965;

  return {
    getWheels: function() {
      return numWheels;
    },
    getFuel: function() {
      return fuelLevel;
    },
    setFuel: function(level) {
      fuelLevel = level;
    }
  };
};

// Car.prototype.getWheels = function() {
//   return numWheels;
// }

var myCar = new Car(3);
var yourCar = new Car(5);

console.log(myCar);
console.log(myCar.getWheels());
console.log(myCar.getFuel());
console.log(myCar.setFuel(40));
console.log(myCar.getFuel());

var Sedan = function() {
  var numDoors = 4;
  var self = this;
  self = new Car(4);
  self.getDoors = function() {
    return numDoors;
  }
  return self;
};

var mySedan = new Sedan();

console.log(mySedan);
console.log(mySedan.getDoors());
console.log(mySedan.getWheels());

var Camry = function() {
  var country = "Japan";
  var self = this;
  self = new Sedan();
  self.getCountry = function() {
    return country;
  }
  return self;
}

var myCamry = new Camry();
// console.log(myCamry);
// console.log(myCamry.getCountry());
// Car.prototype.getYear = function() {
//   return "Hello World";
// };
//
// var myCar = new Car(4);
// console.log(Sedan());

var Test = function() {
  this.blue = 'blue';
};

Test.prototype.getBlue = function() {
  return this.blue;
};

var myTest = new Test()
console.log(myTest.getBlue());
