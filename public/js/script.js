(function() {
    new Vue({
        el: "#main",
        data: {
            images: []
        },
        created: function() {
            console.log("created!");
        },
        mounted: function() {
            console.log("mounted!");
            axios
                .get("/images")
                .then(
                    function(resp) {
                        console.log("res images: ", resp);
                        console.log("res images data: ", resp.data);
                        this.images = resp.data;
                    }.bind(this)
                )
                .catch(function() {
                    console.log("catch");
                });
        },
        updated: function() {
            console.log("updated!");
        },
        methods: {
            handleClick: function() {
                this.logChicken();
            },
            logChicken: function() {
                console.log(this.chicken);
            }
        }
    });
})();
