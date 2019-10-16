(function() {
    Vue.component("first-component", {
        template: "#template",
        data: function() {
            return {
                name: "Pete",
                count: 0
            };
        },
        props: ["postTitle", "selectedFruit"],
        mounted: function() {
            // make an axios request to get the info about the image with the id
            console.log("postTitle", this.postTitle);
            console.log("selectedFruit", this.selectedFruit);
        },
        methods: {
            closeModal: function() {
                console.log("Emitting from the component");
                this.$emit("close", this.count);
            }
        }
    });
    Vue.component("image-modal", {
        template: "#imageTemplate",
        data: function() {
            return {
                images: [],
                username: "",
                title: "",
                desc: ""
            };
        },
        props: ["postTitle", "selectedImage"],
        mounted: function() {
            // make an axios request to get the info about the image with the id
            console.log("postTitle", this.postTitle);
            console.log("selectedImage", this.selectedImage);
            axios
                .get(`/images/${this.selectedImage}`)
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
        methods: {
            closeModal: function() {
                console.log("Emitting from the component");
                this.$emit("close", this.count);
            }
        }
    });
    new Vue({
        el: "#main",
        data: {
            images: [],
            username: "",
            title: "",
            desc: "",
            file: null,
            selectedFruit: null,
            selectedImage: null,
            fruits: [
                {
                    title: "🥝",
                    id: 1
                },
                {
                    title: "🍓",
                    id: 2
                },
                {
                    title: "🍋",
                    id: 3
                }
            ]
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
            },
            closeMe: function(count) {
                console.log("closeMe is running");
                console.log("count is:", count);
            }
        }
    });
})();
