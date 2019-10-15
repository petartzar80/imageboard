(function() {
    new Vue({
        el: "#main",
        data: {
            images: [],
            username: "",
            title: "",
            desc: "",
            file: null
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
            upload: function() {
                console.log(this.username, this.title, this.desc, this.file);
                var fd = new FormData();
                fd.append("image", this.file);
                fd.append("username", this.username);
                fd.append("title", this.title);
                fd.append("desc", this.desc);
                axios
                    .post("/upload", fd)
                    .then(
                        function(res) {
                            console.log("axios upload res: ", res);
                            this.images.unshift(res.data);
                            //unshift the new  image into the array
                        }.bind(this)
                    )
                    .catch(function(error) {
                        this.error = true;
                        console.log("error: ", error);
                    });
            },
            handleClick: function() {
                this.logChicken();
            },
            logChicken: function() {
                console.log(this.chicken);
            },
            fileSelected: function(e) {
                console.log(e.target.files);
                this.file = e.target.files[0];
            }
        }
    });
})();
