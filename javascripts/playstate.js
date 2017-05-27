class PlayState extends Phaser.State {

    preload() {
        const dir = Config.ASSETS;
        // mapa
        game.load.tilemap('level1', `${dir}floor_p_0.json`, null, Phaser.Tilemap.TILED_JSON);
        game.load.image('ground_1x1', `${dir}ground_1x1.png`);

        game.load.spritesheet('dude', `${dir}dude.png`, 32, 48);
        game.load.image('background', `${dir}background4.png`);

        game.load.spritesheet('coin', `${dir}coin.png`, 32, 32);

        game.load.image('trophy', `${dir}trophy-200x64.png`);
    }

    createPlayer() {
        this.player = new Player(game, this.keys, 50, 100, 'dude');
        game.add.existing(this.player);

        // camera seca
        //game.camera.follow(this.player)

        // camera suave: 0.1 para X e Y eh o fator de interpolacao do deslocamento
        // da camera -> quanto maior, mais rapido ela segue o jogador
        game.camera.follow(this.player, Phaser.Camera.FOLLOW_LOCKON, 0.1, 0.1);
    }

    createMap() {
        // chave para o arquivo .json carregado no metodo preload()
        this.map = game.add.tilemap('level1');
        // chave para o arquivo .png de tileset carregado no metodo preload()
        // corresponde ao nome usado para o tileset dentro do Tiled Editor
        this.map.addTilesetImage('ground_1x1');

        // deve ter o mesmo nome usado na camada criada no Tiled Editor
        this.mapLayer = this.map.createLayer('Tile Layer 1');
        // os indices sao os mesmos para o tiles no Tiled Editor, acrescidos em 1
        this.map.setCollisionBetween(1, 11, true, 'Tile Layer 1');
        this.mapLayer.resizeWorld();

        // para cada nova camada: criar camada e definir tiles com colisao
        this.trapsLayer = this.map.createLayer('Traps');
//        this.map.setCollision([29], true, 'Traps');
    }

    createCoins() {
        this.coins = game.add.group();
        // 45 eh o indice do tile
        this.map.createFromObjects('Object Layer 1', 45, 'coin', 0, true, false, this.coins, Coin)
    }

    cretateHud() {
        this.scoreText = game.add.text(16, 16, '', {fontSize: "16px", fill: '#ffffff'});
        this.scoreText.text = "COINS: 0";
        this.scoreText.fixedToCamera = true;
    }

    addScore(amount) {
        this.score += amount;
        this.scoreText.text = "COINS: " + this.score;
    }

    create() {

//        game.add.tileSprite(0, 0, 1920, 1920, 'background');
//        game.world.setBounds(0, 0, 1920, 1920);
//        game.physics.startSystem(Phaser.Physics.P2JS);
//        player = game.add.sprite(game.world.centerX, game.world.centerY, 'player');
//        game.physics.p2.enable(player);
//        player.body.fixedRotation = true;
//        cursors = game.input.keyboard.createCursorKeys();
//        game.camera.follow(player, Phaser.Camera.FOLLOW_LOCKON, 0.1, 0.1);

        game.physics.startSystem(Phaser.Physics.ARCADE);
        game.stage.backgroundColor = '#000000';
        //game.renderer.renderSession.roundPixels = true;

        let bg = game.add.tileSprite(0, 0, Config.WIDTH, Config.HEIGHT, 'background');
        bg.fixedToCamera = true;

        this.keys = game.input.keyboard.createCursorKeys();
        game.physics.arcade.gravity.y = 550;
        this.score = 0;

        let fullScreenButton = game.input.keyboard.addKey(Phaser.Keyboard.ONE);
        fullScreenButton.onDown.add(this.toogleFullScreen, this);

        let screenshotButton = game.input.keyboard.addKey(Phaser.Keyboard.P);
        screenshotButton.onDown.add(this.takeScreenShot, this);

        this.createMap();
        this.createPlayer();
//        this.createCoins(); // deve ser apos o createMap()
        this.cretateHud();
//        this.trophy = new Trophy(game);
        game.add.existing(this.trophy);
    }

    takeScreenShot() {
        // jQuery
        let imgData = game.canvas.toDataURL();

        $('#div-screenshot').append(`<img src=${imgData} alt='game screenshot' class='screenshot'>`);
    }

    toogleFullScreen() {
        game.scale.fullScreenScaleMode = Phaser.ScaleManager.EXACT_FIT;
        if (game.scale.isFullScreen) {
            game.scale.stopFullScreen();
        } else {
            game.scale.startFullScreen(false);
        }
    }

    update() {
        // colisao do player com o mapa
        game.physics.arcade.collide(this.player, this.mapLayer);
        // colisao do player com a camada de armadilhas
        game.physics.arcade.collide(this.player, this.trapsLayer, this.playerDied, null, this);

        // colisao do player com o grupo de moedas
        game.physics.arcade.overlap(this.player, this.coins, this.collectCoin, null, this);
    }

    collectCoin(player, coin) {
        // destroi permanentemente o objeto
        coin.destroy()
        // esconde o objeto e desliga colisao (para reuso futuro)
        //coin.kill() 
        this.addScore(coin.points);
        this.trophy.show('first death');
    }

    playerDied() {
        console.log('player died');
        //this.player.position.setTo(50,200)
        this.player.x = 50;
        this.player.y = 200;
        this.camera.shake(0.02, 200);
    }

    render() {
        if (Config.DEBUG) {
            game.debug.body(this.player);
        }
    }
}
