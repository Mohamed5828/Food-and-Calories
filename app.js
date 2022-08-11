//storage controller
const StorageCtrl = (function(){


    //public methods
    return{

        //storage only store string so convert the objects to string then convert it back to objects when you return it 
        storeItem:function(item){
            let items;
            //check if any items in LS
            if(localStorage.getItem('items') === null){
                items = [];
                //push new items
                items.push(item);

                //set LS
                localStorage.setItem('items',JSON.stringify(items));
            }else{

                //get what is already in LS
                items = JSON.parse(localStorage.getItem('items'));

                 //push new items
                items.push(item);

                //set LS
                localStorage.setItem('items',JSON.stringify(items));
            }

            
            
        },
        getItemsFromStorage: function(){
            let items;
            if(localStorage.getItem('items') === null){
                items = [];
            }else{
                items = JSON.parse(localStorage.getItem('items'));
        }
        return items;

        },
        updateItemStorage: function(updatedItem){
            let items = JSON.parse(localStorage.getItem('items'));

            items.forEach((item, index)=>{
                if(updatedItem.id === item.id){
                    items.splice(index , 1 , updatedItem);
                }
            });
            localStorage.setItem('items', JSON.stringify(items));
        },
        deleteItemFromStorage: function(id){
            let items = JSON.parse(localStorage.getItem('items'));

            items.forEach((item,index)=>{
                if(id === item.id){
                    items.splice(index , 1 )
                }
            });
            localStorage.setItem('items',JSON.stringify(items));
        },
        clearItemsFromLocalStorage: function(){
            localStorage.removeItem('items');
        }
    }
})();


//item controller --------------------------------------
const ItemCtrl = (function(){
//item constructor
    const Item = function(id, name, calories){
        this.id=id;
        this.name = name;
        this.calories = calories;
    }

//data structure / state
const data = {
    items: StorageCtrl.getItemsFromStorage(),
    currentItem: null,
    totalCalories: 0
}
    //public methods
    return{
        getItems: function(){
            return data.items;
        },
        
        addItem: function(name , calories){
            //create id 
            let ID;
            if (data.items.length > 0){
                ID = data.items[data.items.length - 1].id +1;
            }else{
                ID = 0;
            }
            //calories to number
            calories = parseInt(calories);
            
            //create new item
            newItem = new Item(ID, name , calories);

            //add item to array
            data.items.push(newItem);
            return newItem;
        },
        getItemById: function(id){
            let found = null;

            //loop through the items
            data.items.forEach((item)=> {
                if(item.id === id){
                    found = item;
                }
            });
            return found;
        },
        updateItem: function(name , calories){
            //calories to number
            calories = parseInt(calories);

            let found = null;
            data.items.forEach(function(item){
                if(item.id === data.currentItem.id){
                    item.name = name;
                    item.calories = calories;
                    found = item;
                }
            });
            return found;
        },

        deleteItem: function(id){
            //get the ids
            const ids = data.items.map((item)=>{
                return item.id;
            });

            //get index
            const index = ids.indexOf(id);


            //remove item
            const ui1=data.items.splice(index,1)
        },
        clearAllItems: function(){
            data.items=[];
        },
        setCurrentItem: function(item){
            data.currentItem = item;
        },
        getCurrentItem: function(){
            return data.currentItem;
        },

        getTotalCalories: function(){
            let total=0;
            data.items.forEach((item) =>{
                total += item.calories;
            });
            
            //set total cal in data structure
            data.totalCalories= total;

            //return total
            return data.totalCalories;
        },
        
        logData: function (){
            return data;
        }
    }
})();




//UI controller ----------------------------------------------------
const UICtrl = (function(){
    //object to hold all the classes so if class changed in the html you change it here only
    const UISelectors = {
        itemList:'#item-list',
        listItems: '#item-list li',
        addBtn: '.add-btn',
        updateBtn: '.update-btn',
        deleteBtn: '.delete-btn',
        backBtn: '.back-btn',
        clearBtn:'.clear-btn',
        itemNameInput: '#item-name',
        itemCaloriesInput: '#item-calories',
        totalCalories:'.total-calories'
    }
//public methods
return{
    populateItemList: function(items){
        let html = '';
        items.forEach((item)=>{
            html += `<li class="collection-item" id="item-${item.id}">
            <strong>${item.name}: </strong><em>${item.calories} Calories</em>
            <a href="#" class="secondary-content">
                <i class="edit-item fa fa-pencil"></i>
            </a>
        </li>`;
        })

        //insert list items
        document.querySelector(UISelectors.itemList).innerHTML= html;
    },
    getItemInput: function(){
        return {
            name: document.querySelector(UISelectors.itemNameInput).value,
            calories: document.querySelector(UISelectors.itemCaloriesInput).value

        }
    },
    addListItem: function(item){
        //show the list 
        document.querySelector(UISelectors.itemList).style.display = 'block';
        //creat LI element
        const li = document.createElement('li');
        //add class
        li.className= 'collection-item';
        //add id
        li.id = `item-${item.id}`;
        //add html
        li.innerHTML = `<strong>${item.name}: </strong><em>${item.calories} Calories</em>
        <a href="#" class="secondary-content">
            <i class="edit-item fa fa-pencil"></i>
        </a>`;

        //insert item
        document.querySelector(UISelectors.itemList).insertAdjacentElement('beforeend',li)
    },
    updateListItem: function(item){
        let listItems = document.querySelectorAll(UISelectors.listItems);

        //turn node list to array
        listItems = Array.from(listItems);
        listItems.forEach((listItem)=>{
            const itemID = listItem.getAttribute('id');

            if(itemID === `item-${item.id}`){
                document.querySelector(`#${itemID}`).innerHTML = `<strong>${item.name}: </strong><em>${item.calories} Calories</em>
                <a href="#" class="secondary-content">
                    <i class="edit-item fa fa-pencil"></i>
                </a>`;
            }
        });
    },

    deleteListItem: function(id){
        const itemID=`#item-${id}`;
        const item = document.querySelector(itemID);
        item.remove();
    },

    clearInput: function(){
        document.querySelector(UISelectors.itemNameInput).value = '';
        document.querySelector(UISelectors.itemCaloriesInput).value = '';

    },
    addItemToform: function(){
        document.querySelector(UISelectors.itemNameInput).value = ItemCtrl.getCurrentItem().name;
        document.querySelector(UISelectors.itemCaloriesInput).value = ItemCtrl.getCurrentItem().calories;
        UICtrl.showEditState();
    },
    removeItems: function(){
        let listItems = document.querySelectorAll(UISelectors.listItems);
  
        // Turn Node list into array
        listItems = Array.from(listItems);
  
        listItems.forEach(function(item){
          item.remove();
        });
      },
    hideList: function(){
        document.querySelector(UISelectors.itemList).style.display = 'none';
    },
    showTotalCalories: function(totalCalories){
        document.querySelector(UISelectors.totalCalories).textContent = totalCalories;
    },
    clearEditState: function(){
        UICtrl.clearInput();
        document.querySelector(UISelectors.backBtn).style.display = 'none';
        document.querySelector(UISelectors.updateBtn).style.display = 'none';
        document.querySelector(UISelectors.deleteBtn).style.display = 'none';
        document.querySelector(UISelectors.addBtn).style.display = 'inline';
    },
    showEditState: function(){
        document.querySelector(UISelectors.backBtn).style.display = 'inline';
        document.querySelector(UISelectors.updateBtn).style.display = 'inline';
        document.querySelector(UISelectors.deleteBtn).style.display = 'inline';
        document.querySelector(UISelectors.addBtn).style.display = 'none';
    },
    getSelectors: function(){
        return UISelectors ;
    }
}
})();




//app controller -------------------------------------------
const appCtrl = (function(ItemCtrl , StorageCtrl ,UICtrl){
    //load EventListeners
    const loadEventListeners = function(){
        //get Ui selector
        const UISelectors = UICtrl.getSelectors();
        //add item event
        document.querySelector(UISelectors.addBtn).addEventListener('click',itemAddSubmit);

        //disapble submit on enter
        document.addEventListener('keypress',(e)=>{
            if(e.keyCode === 13 ||  e.which === 13){
                e.preventDefault();
                return false;
            }
        })

        //edit icon click event
        document.querySelector(UISelectors.itemList).addEventListener('click',itemEditClick);

        //update item event
        document.querySelector(UISelectors.updateBtn).addEventListener('click',itemUpdateSubmit);

        //delete item event
        document.querySelector(UISelectors.deleteBtn).addEventListener('click',itemDeleteSubmit);

        //back btn event
        document.querySelector(UISelectors.backBtn).addEventListener('click',itemBack);

        //clear all items event
        document.querySelector(UISelectors.clearBtn).addEventListener('click', clearAllItemsClick);
    
    }
    //add item submit
    const itemAddSubmit = function(e){
        //get form input from uicontroller
        const input = UICtrl.getItemInput();
        //check for name and calories input
        if(input.name !== '' && input.calories !== ''){
            //add item
            const newItem = ItemCtrl.addItem(input.name , input.calories);

            //add item to UI list
            UICtrl.addListItem(newItem);

            //get the total calories
            const totalCalories = ItemCtrl.getTotalCalories();

            //add total calories to ui
            UICtrl.showTotalCalories(totalCalories);

            //sotre in LStorage
            StorageCtrl.storeItem(newItem);

            //clear fields
            UICtrl.clearInput();

        }
        e.preventDefault();
    }

    //click edit item
    const itemEditClick = function(e){
        if(e.target.classList.contains('edit-item')){
            //get list item id(item-0 , item-1)
            const listId = e.target.parentNode.parentNode.id;
            

            //break into an array
            const listIdArr = listId.split('-');

            //get the actual id
            const id = parseInt(listIdArr[1]);

            //get item
            const itemToEdit =ItemCtrl.getItemById(id);

            //set current item
            ItemCtrl.setCurrentItem(itemToEdit);

            //add item to form
            UICtrl.addItemToform();
        }
        e.preventDefault();
    }

    //update item submit
    const itemUpdateSubmit = function(e){
        //get item input
        const input =UICtrl.getItemInput();

        //update item
        const updatedItem = ItemCtrl.updateItem(input.name , input.calories)
        //update ui
        UICtrl.updateListItem(updatedItem);

        //get the total calories
        const totalCalories = ItemCtrl.getTotalCalories();

        //add total calories to ui
        UICtrl.showTotalCalories(totalCalories);

        //update local storage
        StorageCtrl.updateItemStorage(updatedItem);
        
        UICtrl.clearEditState();
        
        e.preventDefault();
    }

    //back button
    const itemBack =function(e){
        UICtrl.clearEditState();
        e.preventDefault();
    }

    //delete button
    const itemDeleteSubmit = function(e){
        //get current item
        const currentItem = ItemCtrl.getCurrentItem();

        //delete from data structure
        ItemCtrl.deleteItem(currentItem.id);

        //delete from the UI
        UICtrl.deleteListItem(currentItem.id);
         //get the total calories
         const totalCalories = ItemCtrl.getTotalCalories();

         //add total calories to ui
         UICtrl.showTotalCalories(totalCalories);

         //delete from local storage
         StorageCtrl.deleteItemFromStorage(currentItem.id);
         UICtrl.clearEditState();

        e.preventDefault();
    };

        //clear items event
    // Clear items event
    const clearAllItemsClick = function(){
        // Delete all items from data structure
        ItemCtrl.clearAllItems();

        // Get total calories
        const totalCalories = ItemCtrl.getTotalCalories();
        // Add total calories to UI
        UICtrl.showTotalCalories(totalCalories);

        // Remove from UI
        UICtrl.removeItems();

        //remove from ls
        StorageCtrl.clearItemsFromLocalStorage();

        // Hide UL
        UICtrl.hideList();
        
    }

    //public methods
    return{
        init: function(){
            //clear edit state / set intial state
            UICtrl.clearEditState();

            console.log('Initializing App...')

            //fetch items from data structure
            const items = ItemCtrl.getItems();

            //check if any items
            if(items.length === 0){
                UICtrl.hideList();
            }else{
                //populate list with items
                UICtrl.populateItemList(items);
            }

             //get the total calories
             const totalCalories = ItemCtrl.getTotalCalories();

             //add total calories to ui
             UICtrl.showTotalCalories(totalCalories);
 
            //load event listeners 
            loadEventListeners();
        }
    }

})(ItemCtrl , StorageCtrl , UICtrl);

//Initializing App
appCtrl.init();
