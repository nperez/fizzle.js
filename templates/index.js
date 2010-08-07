Module("Hoggalogga", function (m) {
    Class("Template", {
        has: {
            env: { is: "rw" },
            content: { is : "rw"}
        },
        methods: {
            Render: function() {
                this.AddScript();
                this.AddHeader();
                this.AddContent();
                this.AddFooter();
            },
            AddScript: function() {
                Fizzle('#extra_scripts', this.content).appendChild('alert("Hello, World!");');
            },
            AddHeader: function() {
                Fizzle('#header', this.content).setChildren(<h1>Server-side JavaScript templating!</h1>);
            },
            AddContent: function() {
                Fizzle('#content', this.content).setChildren(<p>This is the first little hello world</p>);
            },
            AddFooter: function() {
                Fizzle('#footer', this.content).setChildren(<span style="text-decoration: underline;">{this.env.some_perl_value}</span>);
            }
        }
    });
});

