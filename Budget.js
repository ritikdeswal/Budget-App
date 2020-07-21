var BudgetController=(function(){
    var Expense=function(id,value,description)
    {
        this.id=id;
        this.value=value;
        this.description=description;
        this.percentage=-1;
    }
    var Income=function(id,value,description)
    {
        this.id=id;
        this.value=value;
        this.description=description;
    }
    Expense.prototype.calcPerc=function(totalInc){
        if(totalInc>0)
        this.percentage=Math.round((this.value/totalInc)*100);
        else 
        this.percentage=-1;
 }
     Expense.prototype.getPerc=function(){
         return this.percentage;
     }

    var data={
        allitems:{
            inc:[],
            exp:[]

        },
        totals:{
            inc:0,
            exp:0
        },
        budget:0,
        percentage:-1
       
    }
    var budgetcalc=function(type){
        var sum=0;
        data.allitems[type].forEach(function(cur){
            sum=sum+cur.value;
        })
        data.totals[type]=sum;

    }

    return{
        addditem:function(type,val,des){
            var newitem;
            var ID;
            
            if(data.allitems[type].length>0){
                ID=data.allitems[type][data.allitems[type].length-1].id+1;

            }
            else ID=0;
            
            if(type==='exp')
            {
                 newitem=new Expense(ID,val,des);
            }
            else if(type==='inc')
            {
                 newitem=new Income(ID,val,des);
            }
            data.allitems[type].push(newitem);
            return newitem;
        },
        deleteitem:function(type,id){var index,ids;
            ids= data.allitems[type].map(function(current){
               return current.id;
            }
            );
            index=ids.indexOf(id);
            if(index!==-1){data.allitems[type].splice(index,1);}
            

        },
        calculateBudget:function(){
           //1.total income
           budgetcalc('inc');
           //2.total expense
           budgetcalc('exp');
           //3.budget=income-expense
           data.budget=data.totals.inc-data.totals.exp;
           //4. percentage
           if(data.totals.inc>0)
           data.percentage=Math.round((data.totals.exp/data.totals.inc)*100);
           else  data.percentage=-1;

        },
        calculatePercentage:function(){
            data.allitems.exp.forEach(function(curr)
            {
                curr.calcPerc(data.totals.inc);
            })


        },
        getPercentage:function(){
            var percArr;
           percArr= data.allitems.exp.map(function(cur){
                return cur.getPerc();
            });
            return percArr;
              },
        getBudget:function()
        {
            return{
                totalInc:data.totals.inc,
                totalExp:data.totals.exp,
                budget:data.budget,
                percentage:data.percentage

            }
        },
        testing:function(){
            console.log(data);
        }

    }
})();




var UIController=(function(){
    var DOMstrings={
        inputtype:'.add__type',
        inputDescription:'.add__description',
        inputValue:'.add__value',
        inputBtn:'.add__btn',
        incomeContainer:".income__list",
        expenseContainer:".expenses__list",
        incLabel:'.budget__income--value',
        budgetLabel:'.budget__value',
        expLabel:'.budget__expenses--value',
        percentageLabel:'.budget__expenses--percentage',
        container:'.container',
        expensePercLabel:'.item__percentage',
        date:".budget__title--month"
    };
   var formatNumber=function(num,type){
        var numsplit,int,dec;
        //1.+before inc - before exp
        //2.2 decmal places representation    2345 23456
        //3.comma for thousand
        num=Math.abs(num);
        num=num.toFixed(2);
        numsplit=num.split('.');
        int=numsplit[0];
        dec=numsplit[1];
        if(int.length>3){
           int= int.substr(0,int.length-3)+','+int.substr(int.length-3,3);
        }
        if(type==='exp'){
            return '-'+int+'.'+dec;
        }
        else
        return '+'+int+'.'+dec;

    };

    return{
        getInput:function()
        {
           return{
            type:document.querySelector(DOMstrings.inputtype).value,
            description:document.querySelector(DOMstrings.inputDescription).value,
            value:parseFloat(document.querySelector(DOMstrings.inputValue).value)//convert value from string to floating number

           }
            


        },
        addListitem:function(obj,type){
            var html;
            var newhtml;
            //1.add HTML string with placeholder
            if(type==='inc'){
                html='  <div class="item clearfix" id="inc-%id%"><div class="item__description">%description%</div><div class="right clearfix"><div class="item__value">%value%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>';
                element=DOMstrings.incomeContainer;
            }
           
            else if(type==='exp'){
                html=' <div class="item clearfix" id="exp-%id%"><div class="item__description">%description%</div><div class="right clearfix"><div class="item__value">%value%</div><div class="item__percentage">21%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div>'
                element=DOMstrings.expenseContainer;
            }
            
            //2.replace placeholder with actual string
            newhtml=html.replace('%id%',obj.id);
            newhtml=newhtml.replace('%description%',obj.description);
            newhtml=newhtml.replace('%value%',formatNumber(obj.value,type));
            //3.show 
            document.querySelector(element).insertAdjacentHTML('beforeend',newhtml);

        },
        deleteListitem:function(selectorID){
           var el= document.getElementById(selectorID);
           el.parentNode.removeChild(el);


        },
        
            

    
        clearFields:function(){
            var field,fieldArr;
            field=document.querySelectorAll(DOMstrings.inputDescription+','+DOMstrings.inputValue);
            fieldArr=Array.prototype.slice.call(field);
            fieldArr.forEach(function(current,index,array) {
                current.value="";
                
            });
            fieldArr[0].focus();

        },
        displayBudget:function(obj){
            if(obj.budget>0)
            document.querySelector(DOMstrings.budgetLabel).textContent=formatNumber(obj.budget,'inc');
            if(obj.budget<=0)
            document.querySelector(DOMstrings.budgetLabel).textContent=formatNumber(obj.budget,'exp');
            document.querySelector(DOMstrings.incLabel).textContent=formatNumber(obj.totalInc,'inc');
            document.querySelector(DOMstrings.expLabel).textContent=formatNumber(obj.totalExp,'exp');
            if(obj.percentage>0)
            document.querySelector(DOMstrings.percentageLabel).textContent=obj.percentage+"%";
            else
            document.querySelector(DOMstrings.percentageLabel).textContent='---';
         },
         displayPercentage:function(percentages){
           /* var field,fieldArr;
             field=document.querySelectorAll(DOMstrings.expensePercLabel);
             fieldArr= Array.prototype.slice.call(field);
             fieldArr.forEach(function(cur,index){
                 cur.textContent=percentages[index]+'%;
             })*/
             field=document.querySelectorAll(DOMstrings.expensePercLabel);
             var fieldForEach=function(list,callback){
                 for(var i=0;i<list.length;i++){
                     callback(list[i],i);

                 }
             };
            
             var callback=function(cur,index){
                 cur.textContent=percentages[index]+"%";

             }
             fieldForEach(field,callback
                )

            


         },
         displayMonth:function(){
             var now=new Date();
             var year=now.getFullYear();
             var month=now.getMonth();
             var months=['January','February','March','April','May','June','July','july','August','Septemer','October','November','December'];
             document.querySelector(DOMstrings.date).textContent=months[month]+' '+year;


         },
         Changed:function(){
             var fields=document.querySelectorAll(DOMstrings.inputDescription+','+DOMstrings.inputValue+','+DOMstrings.inputtype);
             var fieldArr=Array.prototype.slice.call(fields);
             fieldArr.forEach(function(cur){
                 cur.classList.toggle('red-focus');})
                 document.querySelector(DOMstrings.inputBtn).classList.toggle('red');
             

         },
         
        getDOMstrings:function(){
            return DOMstrings;
        }

        
    }
       

})();


var Controller=(function(bc,uc){
    function setupeventListener(){
        var DOM=uc.getDOMstrings();
        document.querySelector(DOM.inputBtn).addEventListener('click',ctrlAdditem);
        document.addEventListener('keypress',function(event){
            if(event.keyCode===13)
            {
             ctrlAdditem();
            }
        });
        document.querySelector(DOM.container).addEventListener('click',ctrlDeleteitem);
        document.querySelector(DOM.inputtype).addEventListener('change',uc.Changed);
    }
    function updateBudget(){
         //5.calculate  budget
         bc.calculateBudget();
         //6.return budget
         var budget=bc.getBudget();
         
         //7.display budget in th UI
         uc.displayBudget(budget);
  

    }
    function updatepercentage(){
        //1.calulate percentage
        bc.calculatePercentage();
        //2.return percentage
        var percentages=bc.getPercentage();
        //3.display on UI
       // console.log(percentages);
        uc.displayPercentage(percentages);
    }
   
    function ctrlAdditem()
    {
        // 1.receive input
       var input= uc.getInput();
       if(input.description!==" "&& !isNaN(input.value)&&input.value>0){
            //2.put input in data structure in budget controller
       var newitem=bc.addditem(input.type,input.value,input.description);
       // console.log(input);
        // display new item in the UI
        uc.addListitem(newitem,input.type);
        //4.clear input fields
        uc.clearFields();
        //5.calculate and update budget
        updateBudget();
        //6.calculate and update percentage
        updatepercentage();
    
        
       

       }

      
    }
    var ctrlDeleteitem=function(event){
        var itemID,div,type,ID;
        itemID= event.target.parentNode.parentNode.parentNode.parentNode.id;//getting id of the parent inc-0
        if(itemID){
            div=itemID.split('-');//['inc','0']
            type=div[0];
            ID=parseInt(div[1]);  
           bc.deleteitem(type,ID);//deleting item from data structure
           uc.deleteListitem(itemID);//deleting item from UI
           //update budget
           updateBudget();
           //calculate and update percentage
           updatepercentage();


        }
          
      }
    return {
        init:function(){
           
            uc.displayBudget({totalInc:0,
                totalExp:0,
                budget:0,
                percentage:0}
            );
            console.log("program has started");
            setupeventListener();
            uc.displayMonth();
        }
    }
 

})(BudgetController,UIController);
Controller.init();
