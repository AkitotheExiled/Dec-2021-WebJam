

function checkClickHideDropdown(event, tar, dropdown) {
    if (!document.getElementById(tar).contains(event.target) ) {
        let drop = document.getElementsByClassName(dropdown);
          drop[0].style.display = 'none';
      }
}
window.addEventListener('click', function(e){
        checkClickHideDropdown(e, "menu", 'dropdown-content');
        checkClickHideDropdown(e, "shopping", 'shoppingbag');
      })


let menu = document.getElementById('menu');
      menu.addEventListener("click", function() {
      let dropdown = document.getElementsByClassName('dropdown-content');
      dropdown[0].style.display = 'block';
            })
      
let shop = document.getElementById('shopping');
    shop.addEventListener("click", function() {
    let dropdown = document.getElementById('bagtoShow');
    dropdown.style.display = 'block';
      })



       


// Thanks Ionut Daniel

const slider = document.querySelector('.container');
let isDown = false;
let startX;
let scrollLeft;

slider.addEventListener('mousedown', (e) => {
  isDown = true;
  slider.classList.add('active');
  startX = e.pageX - slider.offsetLeft;
  scrollLeft = slider.scrollLeft;
});
slider.addEventListener('mouseleave', () => {
  isDown = false;
  slider.classList.remove('active');
});
slider.addEventListener('mouseup', () => {
  isDown = false;
  slider.classList.remove('active');
});
slider.addEventListener('mousemove', (e) => {
  if(!isDown) return;
  e.preventDefault();
  const x = e.pageX - slider.offsetLeft;
  const walk = (x - startX) * 3; //scroll-fast
  slider.scrollLeft = scrollLeft - walk;

});

function show(elementId) {
  const ele = document.getElementById(elementId);
  if (!ele) {
    alert("no such element");
    return;
  }

  const content = document.getElementsByClassName('main');
  for (let i = 0; i < content.length;i++) {
    content[i].style.display = 'none';
  }

  ele.style.display = 'block';
}

Storage.prototype.setObj = function(key, obj) {
  return this.setItem(key, JSON.stringify(obj))
}
Storage.prototype.getObj = function(key) {
  return this.getItem(key)
}
function addItemToBag(item) {
  
  let parent = item.parentNode;
  let grandparent = parent.parentNode;
  let qty = parent.children[0].value;
  let cost = item.querySelector(".itemCost").innerText.slice(1);
  let name = grandparent.querySelector(".productName").innerText;
  let img = grandparent.querySelector(".productImg").children[0].getAttribute('src');
  let organizedItem = {quantity: qty, cost: cost, name: name, img: img};
  
  let bag = localStorage.getObj("bag");


  
  if (bag === null) {
    localStorage.setObj("bag", [organizedItem]);
  } else {
    let newBag = JSON.parse(bag);
    newBag.push(organizedItem);
    localStorage.setObj("bag", newBag);
  }
  updateShoppingBag(organizedItem);
  updateTotal(organizedItem);
  updateBadge();

}

function getTotalCostFromStorage() {
  let bag = JSON.parse(localStorage.getObj("bag"));
  if (bag === null) {
    return 0;
  }
    let cost = 0;
    for (let i = 0; i < bag.length; i++) {
      cost += parseInt(bag[i].cost);
    }
    return cost;
}
function getTotalQtyFromStorage() {
    let bag = JSON.parse(localStorage.getObj("bag"));
    if (bag === null) {
      return 0;
    }
    let qty = 0;
    for (let i = 0; i < bag.length; i++) {
      qty += parseInt(bag[i].quantity);
    }
    return qty;
}

function updateBadge() {
  let shop = document.getElementById('shopping');
  shop.querySelector('.button_badge').innerText = getTotalQtyFromStorage();
}
function updateShoppingBag(bagItem) {
    let items = document.querySelector('#fItems');


    let foodItem = document.createElement('div');
    foodItem.className = "foodItem";
    let foodImg = document.createElement('div');
    foodImg.className = "foodImg";
    let img = document.createElement('img');
    img.setAttribute('src', bagItem.img);
    foodImg.append(img);
    let foodcont = document.createElement('div');
    foodcont.className = "foodcontainer";
    let foodname = document.createElement('div');
    foodname.className = "foodName";
    foodname.innerText = bagItem.name;
    let foodcost = document.createElement('div');
    foodcost.className = "foodCost";
    foodcost.innerText = bagItem.cost
    foodcont.append(foodname, foodcost);
    let foodqty = document.createElement('select');
    foodqty.className = 'foodQty';
    let opt1 = document.createElement('option');
    opt1.value = "0";
    opt1.innerText = '0(remove)';
    let opt2 = document.createElement('option');
    opt2.value = parseInt(bagItem.quantity);
    opt2.innerText = bagItem.quantity;
    foodqty.append(opt2, opt1);
    foodItem.append(foodImg, foodcont, foodqty);
    items.append(foodItem);

    

}

function updateCheckout(bagItem) {
  let items = document.querySelector('#fItems');
  let orders = document.querySelector('#orderList');

  let foodItem = document.createElement('div');
  foodItem.className = "foodItem";
  let foodImg = document.createElement('div');
  foodImg.className = "foodImg";
  let img = document.createElement('img');
  img.setAttribute('src', bagItem.img);
  foodImg.append(img);
  let foodcont = document.createElement('div');
  foodcont.className = "foodcontainer";
  let foodname = document.createElement('div');
  foodname.className = "foodName";
  foodname.innerText = bagItem.name;
  let foodcost = document.createElement('div');
  foodcost.className = "foodCost";
  foodcost.innerText = bagItem.cost
  foodcont.append(foodname, foodcost);
  let foodqty = document.createElement('select');
  foodqty.className = 'foodQty';
  let opt1 = document.createElement('option');
  opt1.value = "0";
  opt1.innerText = '0(remove)';
  let opt2 = document.createElement('option');
  opt2.value = parseInt(bagItem.quantity);
  opt2.innerText = bagItem.quantity;
  foodqty.append(opt2, opt1);
  foodItem.append(foodImg, foodcont, foodqty);

  orders.append(foodItem);
}

function updateTotal() {
  let order = document.querySelector('.orderTotal');
  console.log(order);
  let cost = parseInt(order.innerText) 
  order.innerText = cost + parseInt(getTotalCostFromStorage());

  document.querySelectorAll('.foodQty').forEach(item => {
    item.addEventListener('change', function() {
        if (this.value === 0) {
          console.log('0');
          let name = this.parentNode.foodName.innerText;
          removeItemFromStorage(name);
        }
    })
  })
}
function populateBag() {
  let bag = returnParsedBag();
  let currentCount = document.getElementsByClassName("foodItem");
  if (bag === null || bag.length <= 0 || currentCount.length === bag.length) {
    return;
  }

  for(let i = 0; i < bag.length;i++) {
    updateShoppingBag(bag[i]);
    updateCheckout(bag[i]);
  }
  
}

function removeItemFromStorage(name) {
  let bag = returnParsedBag();

  for (let i = 0; i < bag.length; i++) {
    if (bag[i].name === name) {
      localStorage.setObj('bag', bag.splice(bag[i], 1))
    }
  }
}
function returnParsedBag() {
  let bag = localStorage.getObj("bag");
  return JSON.parse(bag);
}
function placeOrder() {
  localStorage.clear();
}
window.addEventListener('DOMContentLoaded', (event) => {
  populateBag();
  updateBadge();
});

