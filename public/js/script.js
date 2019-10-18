(function() {
    Vue.component("image-modal", {
        template: "#imageTemplate",
        data: function() {
            return {
                images: [],
                comments: [],
                username: "",
                title: "",
                desc: "",
                comment: "",
                user: ""
            };
        },
        props: ["postTitle", "selectedImage"],
        watch: {
            selectedImage: function() {
                this.imageAndComments();
            }
        },
        mounted: function() {
            this.imageAndComments();
        },
        // mounted: function() {
        //     // make an axios request to get the info about the image with the id
        //     console.log("postTitle", this.postTitle);
        //     console.log("selectedImage", this.selectedImage);
        //     axios
        //         .get(`/images/${this.selectedImage}`)
        //         .then(
        //             function(resp) {
        //                 console.log("res images: ", resp);
        //                 console.log("res images data: ", resp.data);
        //                 this.images = resp.data.images;
        //                 this.comments = resp.data.comments.reverse();
        //                 // this.comments.unshift(resp.data.comments);
        //                 // this.images.unshift(resp.data);
        //                 // this.username = resp.data[0].
        //             }.bind(this)
        //         )
        //         .catch(function() {
        //             console.log("catch");
        //         });
        // },
        methods: {
            closeModal: function() {
                console.log("Emitting from the component");
                this.$emit("close", this.count);
            },
            submit: function() {
                let commentData = {
                    imageId: this.selectedImage,
                    user: this.user,
                    comment: this.comment
                };
                axios
                    .post("/comment", commentData)
                    .then(
                        function(res) {
                            console.log("axios upload res: ", res);
                            console.log("res.data.comment:", res.data.comment);
                            // this.comment = res.data.comment;
                            this.comments.unshift(res.data);
                            //unshift the new  image into the array
                        }.bind(this)
                    )
                    .catch(function(error) {
                        this.error = true;
                        console.log("error: ", error);
                    });
            },
            imageAndComments: function() {
                // make an axios request to get the info about the image with the id
                console.log("postTitle", this.postTitle);
                console.log("selectedImage", this.selectedImage);
                axios
                    .get(`/images/${this.selectedImage}`)
                    .then(
                        function(resp) {
                            console.log("res images: ", resp);
                            console.log("res images data: ", resp.data);
                            this.images = resp.data.images;
                            console.log(
                                "resp data comments: ",
                                resp.data.comments
                            );
                            this.comments = resp.data.comments.reverse();
                            // this.comments.unshift(resp.data.comments);
                            // this.images.unshift(resp.data);
                            // this.username = resp.data[0].
                        }.bind(this)
                    )
                    .catch(function() {
                        console.log("catch");
                    });
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
            selectedImage: location.hash.slice(1),
            showButton: true
            // selectedImage: null
        },
        created: function() {
            console.log("created!");
        },
        mounted: function() {
            var self = this;
            console.log("mounted!");
            addEventListener("hashchange", function() {
                self.selectedImage = location.hash.slice(1);
                // self.imageId = location.hash.slice(1);
                console.log("hash change event fired!");
            });
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
            moreImg: function() {
                console.log("gimme MOAR");
                let lastId = this.images[this.images.length - 1].id;
                console.log("last id: ", lastId);
                axios
                    .get(`/moreimages/${lastId}`)
                    .then(
                        function(resp) {
                            console.log("res images moar: ", resp);
                            console.log("res images  moar data: ", resp.data);
                            for (let i = 0; i < resp.data.rows.length; i++) {
                                if (
                                    resp.data.rows[i].id ===
                                    resp.data.rows[i].lowest_id
                                ) {
                                    this.showButton = false;
                                }
                                this.images.push(resp.data.rows[i]);
                            }

                            console.log("this.images MOAR: ", this.images);
                        }.bind(this)
                    )
                    .catch(function() {
                        console.log("catch");
                    });
            },
            fileSelected: function(e) {
                console.log(e.target.files);
                this.file = e.target.files[0];
            },
            closeMe: function(count) {
                console.log("closeMe is running");
                console.log("count is:", count);
                this.selectedImage = null;
                location.hash = "";
                history.replaceState(null, null, " ");
            }
        }
    });
})();

// location.hash.slice(1);
