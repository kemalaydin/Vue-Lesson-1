window.addEventListener('load', () => {
    Vue.component('VueCart',{
        props: {
            cart: {
                type: Array,
                required: true
            },
            title: {
                type: String,
                required: true
            },
            type: {
                type: String,
                required: true
            }
        },
        computed: {
            cartTotal() {
                let total = 0;
                this.cart.forEach((item) => {
                    total += parseFloat(item.price,10);
                });
                return total.toFixed(2);
            },
            isShoppingCart() {
                return this.type == "shoppingCart";
            },
            isSavedCart() {
                return this.type == "savedForLater";
            }
        },
        methods: {
            removeFromCart: function (index) {
                return this.cart.splice(index, 1);
            },
            changeCart: function (index) {
                const item = this.removeFromCart(index);
                this.$emit('itemchangedoncart', item[0], this.type);
            }
        },
        template: `
        <div class="card-wrapper">
            <h2>{{  title }} <span v-if="isSavedCart">( {{ cart.length }} item )</span></h2>
            <div class="cart">
                <p v-if="cart.length < 1"> Your Cart is Empty</p>
                <div class="item" v-for="(item, index) in cart">
                    <div class="image">
                        <a v-bind:href="item.url">
                            <img v-bind:src="item.image" />
                        </a>
                    </div>
                    <div class="info"><h4 v-text="item.name"></h4>
                        <p class="seller">by {{  item.seller }}</p>
                        <p class="status available" v-if="item.isAvailable">In stock</p>
                        <p class="shipping" v-if="item.isEligible">Eligible for FREE Shipping & FREE Returns</p>
                        <a href="#" @click="removeFromCart(index)">DELETE</a>
                        <a href="#" v-if="isShoppingCart" @click="changeCart(index)" class="secondary">save for later</a>
                        <a href="#" v-if="isSavedCart" @click="changeCart(index)" class="secondary">Move to cart</a>
                    </div>
                    <p class="price">\${{ item.price }}</p>
                </div>
            </div> 
            <div class="subtotal" v-if="isShoppingCart" v-if="cart.length > 0">
                Subtotal ( {{ cart.length }} items ) : <span class="price">\${{ cartTotal }}</span>
            </div> 
        </div>  
        `
    });

    window.vue = new Vue({
        el: '#app',
        name: 'AmazonCart',
        data: {
            isLoading: true,
            cart: [],
            saved: []
        },
        methods: {
            handleItemChange(item, cartType) {
                if(cartType == "shoppingCart"){
                    this.saved.push(item);
                }else{
                    this.cart.push(item);
                }   
            }
        },
        created() {
            fetch('https://api.jsonbin.io/b/5b9e3eba74ca4633aadd487e')
                .then((res) => { return res.json() })
                .then((res) => { 
                    this.isLoading = false;
                    this.cart = res.cart;
                    this.saved = res.saved;
                })
        }
    });
});